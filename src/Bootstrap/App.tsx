import { type FC, type JSX } from 'react';
import { ChartEditor } from '../Entities/ChartEditor';
import styles from './Styles/App.module.less';

export const App: FC = (): JSX.Element => {
    return (
        <div className={ styles.app }>
            <ChartEditor />
        </div>
    );
};
