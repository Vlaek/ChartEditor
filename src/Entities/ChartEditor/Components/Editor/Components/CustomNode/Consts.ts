import { Position } from 'reactflow';

/** Список точек соединения. */
export const HANDLE_LIST = [
    {
        id: 'top',
        type: 'source',
        position: Position.Top,
        style: {
            top: '-6px',
        }
    },
    {
        id: 'top',
        type: 'target',
        position: Position.Top,
        style: {
            top: '-6px',
        }
    },
    {
        id: 'bottom',
        type: 'source',
        position: Position.Bottom,
        style: {
            bottom: '-6px',
        }
    },
    {
        id: 'bottom',
        type: 'target',
        position: Position.Bottom,
        style: {
            bottom: '-6px',
        }
    },
];
