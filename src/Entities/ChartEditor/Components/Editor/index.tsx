import { useCallback, useEffect, type FC, type JSX } from 'react';
import { useDiagramStore } from '@Entities/ChartEditor/Store/useDiagramStore';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    type OnConnect,
    ConnectionLineType,
    type NodeDragHandler,
    type NodeMouseHandler,
    type EdgeMouseHandler,
    ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NODE_TYPES } from './Consts';
import styles from './Styles/Editor.module.less';

/** Редактор диаграмм. */
export const Editor: FC = (): JSX.Element => {
    const nodes = useDiagramStore(state => state.nodes);
    const edges = useDiagramStore(state => state.edges);
    const addEdge = useDiagramStore(state => state.addEdge);
    const updateNodePosition = useDiagramStore(state => state.updateNodePosition);
    const deleteNode = useDiagramStore(state => state.deleteNode);
    const deleteEdge = useDiagramStore(state => state.deleteEdge);
    const selectedElement = useDiagramStore(state => state.selectedElement);
    const setSelectedElement = useDiagramStore(state => state.setSelectedElement);
    const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(nodes);
    const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(edges);

    // Инициализация
    useEffect(() => {
        setReactFlowNodes(nodes);
    }, [nodes, setReactFlowNodes]);

    // Обновление
    useEffect(() => {
        setReactFlowEdges(edges);
    }, [edges, setReactFlowEdges]);

    // Удаление элемента
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElement) {
                event.preventDefault();

                const isEdge = edges.some(edge => edge.id === selectedElement);

                if (isEdge) {
                    deleteEdge(selectedElement);
                } else {
                    deleteNode(selectedElement);
                }

                setSelectedElement(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, edges, deleteEdge, deleteNode, setSelectedElement]);

    /** Обработчик соединения узлов. */
    const handleNodeConnect: OnConnect = useCallback(
        connection => {
            if (connection.source && connection.target && connection.sourceHandle && connection.targetHandle) {
                addEdge(connection.source, connection.target, connection.sourceHandle, connection.targetHandle);
            }
        },
        [addEdge],
    );

    /** Обработчик обновления позиции узла при остановке. */
    const handleNodeDragStop: NodeDragHandler = useCallback(
        (_, node) => {
            updateNodePosition(node.id, node.position);
        },
        [updateNodePosition],
    );

    /** Обработчик обновления позиции узла при перемещении. */
    const handleNodeDrag: NodeDragHandler = useCallback(
        (_event, _node, nodes) => {
            if (nodes.length > 1) {
                nodes.forEach(n => {
                    updateNodePosition(n.id, n.position);
                });
            }
        },
        [updateNodePosition],
    );

    /** Обработчик клика на элемент */
    const handleEdgeClick: EdgeMouseHandler = useCallback(
        (_, edge) => {
            setSelectedElement(edge.id);
        },
        [setSelectedElement],
    );

    /** Обработчик клика на узел */
    const handleNodeClick: NodeMouseHandler = useCallback(
        (_, node) => {
            setSelectedElement(node.id);
        },
        [setSelectedElement],
    );

    /** Обработчик клика на пустом месте */
    const handlePaneClick = useCallback(() => {
        setSelectedElement(null);
    }, [setSelectedElement]);

    return (
        <div className={ styles['editor-container'] }>
            <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleNodeConnect}
                onNodeDragStop={handleNodeDragStop}
                onNodeDrag={handleNodeDrag}
                onEdgeClick={handleEdgeClick}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                nodeTypes={NODE_TYPES}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
                isValidConnection={(connection) => {
                    const { source, target } = connection;
        
                    return source !== target;;
                }}
                attributionPosition="bottom-right"
                deleteKeyCode={null}
            >
                <Background />

                <Controls />

                <MiniMap />
            </ReactFlow>
        </div>
    );
};
