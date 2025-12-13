import { useCallback, type FC, type JSX } from 'react';
import { SHAPE_CONFIG, SHAPE_LIMITS } from '@Common/Consts/Diagram';
import { type EShapeType } from '@Common/Models/Diagram';
import { useDiagramStore } from '@Entities/ChartEditor/Store/useDiagramStore';
import cn from 'classnames';
import { useReactFlow, useStoreApi } from 'reactflow';
import { SHAPES, SIZE_TRANSFORM } from './Consts';
import styles from './Styles/Sidebar.module.less';
import { TRANSLATIONS } from './Translations';

/** Боковая панель редактора. */
export const Sidebar: FC = (): JSX.Element => {
    const addNode = useDiagramStore(state => state.addNode);
    const nodes = useDiagramStore(state => state.nodes);
    const { screenToFlowPosition } = useReactFlow();
    const store = useStoreApi();

    // Функция вычисления количества фигур каждого типа
    const getShapeCount = useCallback(
        (type: EShapeType) => {
            return nodes.filter(node => node.type === type).length;
        },
        [nodes],
    );

    /** Обработчик добавления фигуры по центру экрана. */
    const handleAddShape = (type: EShapeType) => {
        if (getShapeCount(type) >= SHAPE_LIMITS[type]) {
            return;
        }

        const { width, height } = store.getState();

        const screenCenterX = width / 2 - SHAPE_CONFIG[type].width / 2;
        const screenCenterY = height / 2 - SHAPE_CONFIG[type].height / 2;

        const position = screenToFlowPosition({
            x: screenCenterX,
            y: screenCenterY,
        });

        addNode(type, position);
    };

    return (
        <div className={ styles.sidebar }>
            <h2 className={ styles.sidebar__title }>
                {TRANSLATIONS.title}
            </h2>

            <div className={ styles.shape__list }>
                {SHAPES.map(shape => {
                    const config = SHAPE_CONFIG[shape];
                    const count = getShapeCount(shape);
                    const isDisabled = count >= SHAPE_LIMITS[shape];
                    const shapeLabel = TRANSLATIONS.shape[config.label];

                    return (
                        <button
                            key={shape}
                            className={cn(styles.shape__card, {
                                [styles['shape__card--disabled']]: isDisabled
                            })}
                            onClick={() => !isDisabled && handleAddShape(shape)}
                            disabled={isDisabled}
                        >
                            <div
                                className={ styles.shape__preview }
                                style={{
                                    backgroundColor: config.color,
                                    width: config.width * SIZE_TRANSFORM,
                                    height: config.height * SIZE_TRANSFORM,
                                    borderRadius: config.radius,
                                    clipPath: config.clipPath,
                                }}
                            />

                            <div className={ styles.shape__info }>
                                <span className="shape-label">{shapeLabel}</span>
                            </div>

                            <span className={ styles.shape__count }>
                                {count}/{SHAPE_LIMITS[shape]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
