import type { IDiagramData } from '@Common/Models/Diagram';

/** Функция для генерации идентификаторов. */
export const generateId = (): string => {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/** Функция для экспорта диаграммы в JSON-формате. */
export const exportDiagram = (data: IDiagramData): void => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `diagram-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/** Функция для импорта диаграммы с JSON-формата. */
export const importDiagram = (file: File): Promise<IDiagramData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const data = JSON.parse(content) as IDiagramData;

                if (!data.nodes || !data.edges) {
                    throw new Error('Некорректный формат файла диаграммы');
                }

                data.nodes.forEach((node, index) => {
                    if (!node.id || !node.type || !node.position || !node.data) {
                        throw new Error(`Некорректный узел на позиции ${index}`);
                    }
                });

                data.edges.forEach((edge, index) => {
                    if (!edge.id || !edge.source || !edge.target) {
                        throw new Error(`Некорректная связь на позиции ${index + 1}`);
                    }
                });

                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Ошибка чтения файла'));
        };

        reader.readAsText(file);
    });
};
