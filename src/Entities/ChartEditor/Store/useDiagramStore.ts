import { exportDiagram, generateId } from '@Common/Utils/Diagram';
import { create } from 'zustand';
import type { IDiagramData, IDiagramEdge, IDiagramNode, EShapeType, EConnectionType, IPosition } from '@Common/Models/Diagram';

/** Стор диаграмм. */
interface IDiagramStore {
    /** Узлы диаграммы. */
    nodes: IDiagramNode[];
    /** Рёбра диаграммы. */
    edges: IDiagramEdge[];
    /** Выбранный элемент. */
    selectedElement: Nullable<string>;
    /** Функция добавления узла. */
    addNode: (type: EShapeType, position: IPosition) => void;
    /** Функция обновления позиции узла. */
    updateNodePosition: (id: string, position: IPosition) => void;
    /** Функция удаления узла. */
    deleteNode: (id: string) => void;
    /** Функция добавления ребра. */
    addEdge: (source: string, target: string, sourceHandle: string, targetHandle: string) => void;
    /** Функция удаления ребра. */
    deleteEdge: (id: string) => void;
    /** Функция очистки диаграммы. */
    clearDiagram: () => void;
    /** Функция установки выбранного элемента. */
    setSelectedElement: (id: Nullable<string>) => void;
    /** Функция сохранения диаграммы. */
    saveDiagram: () => void;
    /** Функция загрузки диаграммы. */
    loadDiagram: (data: IDiagramData) => void;
}

/** Хук для работы с диаграммами. */
export const useDiagramStore = create<IDiagramStore>((set, get) => ({
    nodes: [],
    edges: [],
    selectedElement: null,

    addNode: (type, position) => {
        const state = get();

        const newNode: IDiagramNode = {
            id: generateId(),
            type,
            position,
            data: {
                label: `${state.nodes.filter(n => n.type === type).length + 1}`,
                connections: {
                    top: null,
                    bottom: null,
                },
            },
        };

        set(state => ({ nodes: [...state.nodes, newNode] }));
    },

    updateNodePosition: (id, position) => {
        set(state => ({
            nodes: state.nodes.map(node => (node.id === id ? { ...node, position } : node)),
        }));
    },

    deleteNode: (id) => {
        const { nodes, edges } = get();
        const nodeToDelete = nodes.find(n => n.id === id);

        if (!nodeToDelete) {
            return;
        }

        const connectedEdges = edges.filter(edge => edge.source === id || edge.target === id);

        set(state => ({
            nodes: state.nodes.filter(n => n.id !== id),
            edges: state.edges.filter(edge => !connectedEdges.some(e => e.id === edge.id)),
        }));
    },

    addEdge: (source, target, sourceHandle, targetHandle) => {
        if (source === target) {
            return;
        }

        const state = get();
        const existingEdges = state.edges;
    
        /** Функция для удаления ребра и очистки связей в узлах. */
        const removeEdge = (edgeId: string) => {
            const edgeToRemove = existingEdges.find(edge => edge.id === edgeId);

            if (!edgeToRemove) {return;}
        
            set(state => {
                const updatedNodes = state.nodes.map(node => {
                    if (node.id === edgeToRemove.source || node.id === edgeToRemove.target) {
                        const connections = { ...node.data.connections };

                        if (connections.top === edgeId) {connections.top = null;}
                        if (connections.bottom === edgeId) {connections.bottom = null;}
                    
                        return {
                            ...node,
                            data: { ...node.data, connections },
                        };
                    }

                    return node;
                });
            
                return {
                    nodes: updatedNodes,
                    edges: state.edges.filter(edge => edge.id !== edgeId),
                };
            });
        };

        const sourceNode = state.nodes.find(node => node.id === source);

        if (sourceNode) {
            const existingSourceEdgeId = sourceHandle === 'top' 
                ? sourceNode.data.connections.top 
                : sourceNode.data.connections.bottom;
        
            if (existingSourceEdgeId !== null) {
                removeEdge(existingSourceEdgeId);
            }
        }

        const targetNode = state.nodes.find(node => node.id === target);

        if (targetNode) {
            const existingTargetEdgeId = targetHandle === 'top'
            ? targetNode.data.connections.top
            : targetNode.data.connections.bottom;
        
            if (existingTargetEdgeId !== null) {
                removeEdge(existingTargetEdgeId);
            }
        }

        const currentState = get();
        const isDuplicateConnection = currentState.edges
            .some((edge) => edge.source === source && edge.target === target
                && edge.sourceHandle === sourceHandle && edge.targetHandle === targetHandle
            );

        if (isDuplicateConnection) {
            return;
        }

        const newEdge: IDiagramEdge = {
            id: generateId(),
            source,
            target,
            sourceHandle: sourceHandle as EConnectionType,
            targetHandle: targetHandle as EConnectionType,
        };

        set(state => {
            const updatedNodes = state.nodes.map(node => {
                if (node.id === source) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            connections: {
                                ...node.data.connections,
                                [sourceHandle]: newEdge.id,
                            },
                        },
                    };
                }

                if (node.id === target) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            connections: {
                                ...node.data.connections,
                                [targetHandle]: newEdge.id,
                            },
                        },
                    };
                }

                return node;
            });

            return {
                nodes: updatedNodes,
                edges: [...state.edges, newEdge],
            };
        });
    },

    deleteEdge: (id) => {
        set(state => {
            const edgeToDelete = state.edges.find(edge => edge.id === id);

            if (!edgeToDelete) {
                return state;
            }

            const updatedNodes = state.nodes.map(node => {
                if (node.id === edgeToDelete.source) {
                    const connections = { ...node.data.connections };

                    if (connections.top === id) {
                        connections.top = null;
                    }

                    if (connections.bottom === id) {
                        connections.bottom = null;
                    }
                    
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            connections,
                        },
                    };
                }

                if (node.id === edgeToDelete.target) {
                    const connections = { ...node.data.connections };

                    if (connections.top === id) {
                        connections.top = null;
                    }

                    if (connections.bottom === id) {
                        connections.bottom = null;
                    }
                    
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            connections,
                        },
                    };
                }

                return node;
            });

            return {
                nodes: updatedNodes,
                edges: state.edges.filter(edge => edge.id !== id),
            };
        });
    },

    clearDiagram: () => {
        set({ nodes: [], edges: [], selectedElement: null });
    },

    setSelectedElement: (id) => {
        set({ selectedElement: id });
    },

    saveDiagram: () => {
        const { nodes, edges } = get();

        exportDiagram({ nodes, edges });
    },

    loadDiagram: (data) => {
        set({
            nodes: data.nodes,
            edges: data.edges,
            selectedElement: null,
        });
    },
}));
