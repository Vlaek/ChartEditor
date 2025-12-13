/** Тип фигуры. */
export enum EShapeType {
    /** Квадрат */
    RECTANGLE = 'rectangle',
    /** Треугольник */
    TRIANGLE = 'triangle',
    /** Круг */
    CIRCLE = 'circle',
}

/** Тип соединения с фигурой. */
export enum EConnectionType {
    /** Сверху */
    TOP = 'top',
    /** Снизу */
    BOTTOM = 'bottom',
}

/** Интерфейс для узла диаграммы. */
export interface IDiagramNode {
    /** Уникальный идентификатор. */
    id: string;
    /** Тип фигуры. */
    type: EShapeType;
    /** Позиция на диаграмме. */
    position: IPosition;
    /** Данные фигуры. */
    data: IDiagramNodeData;
}

/** Интерфейс для позиции на диаграмме. */
export interface IPosition {
    /** Координата X. */
    x: number;
    /** Координата Y. */
    y: number;
}

/** Интерфейс для данных узла. */
interface IDiagramNodeData {
    /** Надпись на фигуре. */
    label: string;
    /** Соединения с другими фигурами. */
    connections: IDiagramNodeDataConnection;
}

/** Интерфейс соединения диаграммы с другими фигурами. */
interface IDiagramNodeDataConnection {
    /** Соединение сверху. */
    top: Nullable<string>;
    /** Соединение снизу. */
    bottom: Nullable<string>;
}

/** Интерфейс для ребра диаграммы. */
export interface IDiagramEdge {
    /** Идентификатор ребра диаграммы. */
    id: string;
    /** Идентификатор источника (начало). */
    source: string;
    /** Идентификатор цели (конец). */
    target: string;
    /** Тип соединения с источником (начало). */
    sourceHandle: EConnectionType;
    /** Тип соединения с целью (конец). */
    targetHandle: EConnectionType;
}

/** Интерфейс для данных диаграммы. */
export interface IDiagramData {
    /** Узлы диаграммы. */
    nodes: IDiagramNode[];
    /** Ребра диаграммы. */
    edges: IDiagramEdge[];
}

/** Интерфейс для ограничений на количество фигур. */
export interface IShapeLimit {
    /** Количество фигур типа "Квадрат". */
    rectangle: number;
    /** Количество фигур типа "Треугольник". */
    triangle: number;
    /** Количество фигур типа "Круг". */
    circle: number;
}
