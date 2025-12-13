import { memo } from 'react';
import { SHAPE_CONFIG } from '@Common/Consts/Diagram';
import { EShapeType } from '@Common/Models/Diagram';
import { useDiagramStore } from '@Entities/ChartEditor/Store/useDiagramStore';
import cn from 'classnames';
import { Handle, type HandleType, type NodeProps } from 'reactflow';
import { HANDLE_LIST } from './Consts';
import styles from './Styles/CustomNode.module.less';

/** Кастомный узел для диаграммы. */
export const CustomNode = memo(({ id, data, type }: NodeProps) => {
    const isTriangle = type === EShapeType.TRIANGLE;
    const config = SHAPE_CONFIG[type as EShapeType];
    const selectedElement = useDiagramStore((state) => state.selectedElement);
    const isSelectedElement = selectedElement === id;
    const setSelectedElement = useDiagramStore(
        (state) => state.setSelectedElement,
    );

    /** Обработчик клика на узел. */
    const handleClick = () => {
        setSelectedElement(id);
    };

    /** Обработчик нажатия клавиш. */
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedElement(id);
        }
    };

    return (
        <div className={cn(styles['node-outer-wrapper'], {
            [styles['selected']]: isSelectedElement,
        })}>
            {/* Рамка выделения */}
            {isSelectedElement && <div className={ styles['selection-border'] } />}
            
            {/* Рамка при наведении */}
            <div className={ styles['hover-border'] } />

            <div className={ styles['custom-node-wrapper'] }>
                {/* Фигура */}
                <div
                    className={cn(styles['custom-node'], {
                        [styles['triangle']]: isTriangle,
                    })}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="button"
                    style={{
                        width: config.width,
                        height: config.height,
                        backgroundColor: config.color,
                        borderRadius: config.radius,
                        clipPath: config.clipPath,
                    }}
                >
                    {/* Лейбл фигуры */}
                    <div className={cn(styles['node__label'], {
                        [styles['triangle__label']]: isTriangle,
                    })}>
                        {data.label}
                    </div>
                </div>

                {/* Точки соединения */}
                {HANDLE_LIST.map(item => (
                    <Handle
                        key={item.id + item.type}
                        type={item.type as HandleType}
                        position={item.position}
                        id={item.id}
                        className={ styles['node__handle'] }
                        style={item.style}
                    />
                ))}
            </div>
        </div>
    );
});