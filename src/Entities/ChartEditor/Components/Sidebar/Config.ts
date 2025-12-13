import { EShapeType } from '@Common/Models/Diagram';

export const getStyleShapeConfig = (type: EShapeType) => {
    if (type === EShapeType.Circle) {
        return {};
    }
};
