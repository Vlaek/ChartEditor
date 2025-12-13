import { type FC, type JSX } from 'react';
import cn from 'classnames';
import { ReactFlowProvider } from 'reactflow';
import { Editor } from './Components/Editor';
import { Sidebar } from './Components/Sidebar';
import { Toolbar } from './Components/Toolbar';
import styles from './Styles/ChartEditor.module.less';

/** Редактор диаграмм. */
export const ChartEditor: FC = (): JSX.Element => {
    return (
        <ReactFlowProvider>
            <div className={ styles.flexContainer }>
                <Sidebar />

                <div className={ cn(styles.flexContainer, styles['flexContainer--column']) }>
                    <Toolbar />

                    <Editor />
                </div>
            </div>
        </ReactFlowProvider>
    );
};
