import { useRef, type FC, type JSX } from 'react';
import { importDiagram } from '@Common/Utils/Diagram';
import { useDiagramStore } from '@Entities/ChartEditor/Store/useDiagramStore';
import cn from 'classnames';
import styles from './Styles/Toolbar.module.less';
import { TRANSLATIONS } from './Translations';

/** Тулбар редактора диаграмм. */
export const Toolbar: FC = (): JSX.Element => {
    const saveDiagram = useDiagramStore(state => state.saveDiagram);
    const loadDiagram = useDiagramStore(state => state.loadDiagram);
    const clearDiagram = useDiagramStore(state => state.clearDiagram);
    const nodes = useDiagramStore(state => state.nodes);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasElements = nodes.length > 0;

    /** Обработчик импортов. */
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            const data = await importDiagram(file);

            loadDiagram(data);
            alert(TRANSLATIONS.alert.importSuccess);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TRANSLATIONS.alert.unknownError;

            alert(`${TRANSLATIONS.alert.error}: ${errorMessage}`);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={ styles.toolbar }>
            <div className={ styles.toolbar__group }>
                <button
                    className={ styles.toolbar__btn }
                    onClick={saveDiagram}
                    disabled={!hasElements}
                    title={hasElements ? TRANSLATIONS.action.save : TRANSLATIONS.action.saveWarning}
                >
                    {TRANSLATIONS.saveButton}
                </button>

                <button className={ styles.toolbar__btn } onClick={() => fileInputRef.current?.click()} title={TRANSLATIONS.action.import}>
                    {TRANSLATIONS.importButton}
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />

                <button
                    className={ cn(styles.toolbar__btn, styles['toolbar__btn--danger']) }
                    onClick={clearDiagram}
                    disabled={!hasElements}
                    title={hasElements ? TRANSLATIONS.action.clear : TRANSLATIONS.action.clearWarning}
                >
                    {TRANSLATIONS.clearButton}
                </button>
            </div>
        </div>
    );
};
