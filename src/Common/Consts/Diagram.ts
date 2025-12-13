import { EShapeType } from '@Common/Models/Diagram';

/** Количество фигур. */
export const SHAPE_LIMITS = {
    rectangle: 5,
    triangle: 5,
    circle: 5,
} as const;

/** Конфигурация фигур. */
export const SHAPE_CONFIG = {
    rectangle: {
        label: EShapeType.RECTANGLE,
        color: '#3b82f6',
        width: 100,
        height: 80,
        radius: '4px',
        clipPath: 'none',
    },
    triangle: {
        label: EShapeType.TRIANGLE,
        color: '#ef4444',
        width: 100,
        height: 80,
        radius: '0',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    },
    circle: {
        label: EShapeType.CIRCLE,
        color: '#10b981',
        width: 100,
        height: 80,
        radius: '50%',
        clipPath: 'none',
    },
} as const;
