import { EShapeType } from '@Common/Models/Diagram';
import { CustomNode } from './Components/CustomNode';
import type { NodeTypes } from 'reactflow';

/** Типы узлов. */
export const NODE_TYPES: NodeTypes = {
    [EShapeType.RECTANGLE]: CustomNode,
    [EShapeType.TRIANGLE]: CustomNode,
    [EShapeType.CIRCLE]: CustomNode,
};
