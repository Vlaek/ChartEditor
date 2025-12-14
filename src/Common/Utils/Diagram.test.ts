/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EConnectionType, EShapeType, type IDiagramData } from '@Common/Models/Diagram';
import { exportDiagram, generateId, importDiagram } from './Diagram';

describe('Тестирование функции generateId:', () => {
    it('генерирование уникального идентификатора', () => {
        const id1 = generateId();
        const id2 = generateId();
        
        expect(id1).not.toBe(id2);
        expect(id1).toMatch(/^id-\d+-[a-z0-9]{9}$/);
        expect(id2).toMatch(/^id-\d+-[a-z0-9]{9}$/);
    });

    it('идентификатор начинается с префикса "id-"', () => {
        const id = generateId();

        expect(id.startsWith('id-')).toBe(true);
    });

    it('идентификатор содержит временную метку', () => {
        const now = Date.now();
        const id = generateId();
        const timestamp = parseInt(id.split('-')[1]);
        
        expect(timestamp).toBeGreaterThanOrEqual(now - 100);
        expect(timestamp).toBeLessThanOrEqual(now + 100);
    });

    it('идентификатор содержит случайную строку из 9 символов', () => {
        const id = generateId();
        const randomPart = id.split('-')[2];
        
        expect(randomPart).toHaveLength(9);
        expect(randomPart).toMatch(/^[a-z0-9]+$/);
    });

    it('генерирование разных идентификаторов при быстрых вызовах', () => {
        const ids = new Set();
        
        for (let i = 0; i < 100; i++) {
            ids.add(generateId());
        }
        
        expect(ids.size).toBe(100);
    });
});

describe('Тестирование функции exportDiagram:', () => {
    const mockDiagramData: IDiagramData = {
        nodes: [
            {
                id: 'node-1',
                type: EShapeType.RECTANGLE,
                position: { x: 100, y: 100 },
                data: {
                    label: 'Тестовый узел',
                    connections: { bottom: null, top: null },
                },
            }
        ],
        edges: [
            {
                id: 'edge-1',
                source: 'node-1',
                target: 'node-2',
                sourceHandle: EConnectionType.BOTTOM,
                targetHandle: EConnectionType.TOP,
            }
        ],
    };

    let mockLink: Partial<HTMLAnchorElement>;
    let mockURL: string;
    let mockClick: jest.Mock;
    let mockAppendChild: jest.Mock;
    let mockRemoveChild: jest.Mock;
    let mockCreateObjectURL: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;

    beforeEach(() => {
        mockURL = 'blob:test-url';
        mockClick = jest.fn();
        mockAppendChild = jest.fn();
        mockRemoveChild = jest.fn();
        mockCreateObjectURL = jest.fn().mockReturnValue(mockURL);
        mockRevokeObjectURL = jest.fn();
        
        mockLink = {
            href: '',
            download: '',
            click: mockClick
        };

        jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
        jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
        jest.spyOn(document, 'createElement').mockImplementation(
            () => mockLink as HTMLAnchorElement,
        );

        global.Blob = jest.fn().mockImplementation((content: unknown, options: unknown) => ({
            content,
            options
        }));
        
        global.URL = {
            createObjectURL: mockCreateObjectURL,
            revokeObjectURL: mockRevokeObjectURL,
        } as any;

        jest.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('создание корректного JSON из данных диаграммы', () => {
        const stringifySpy = jest.spyOn(JSON, 'stringify');
        
        exportDiagram(mockDiagramData);
        
        expect(stringifySpy).toHaveBeenCalledWith(mockDiagramData, null, 2);
    });

    it('создание Blob с правильным типом контента', () => {
        exportDiagram(mockDiagramData);
        
        expect(global.Blob).toHaveBeenCalledWith(
            [JSON.stringify(mockDiagramData, null, 2)],
            { type: 'application/json' }
        );
    });

    it('создание URL для Blob', () => {
        exportDiagram(mockDiagramData);
    
        expect(mockCreateObjectURL).toHaveBeenCalled();
    
        expect(mockCreateObjectURL.mock.calls[0][0]).toMatchObject({
            content: [JSON.stringify(mockDiagramData, null, 2)],
            options: { type: 'application/json' }
        });
    });

    it('установка правильных атрибутов ссылки', () => {
        exportDiagram(mockDiagramData);
        
        expect(mockLink.href).toBe(mockURL);
        expect(mockLink.download).toBe('diagram-1234567890123.json');
    });

    it('добавление и удаление ссылки из DOM', () => {
        exportDiagram(mockDiagramData);
        
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
        expect(mockClick).toHaveBeenCalled();
        expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
    });

    it('очистка URL после скачивания', () => {
        exportDiagram(mockDiagramData);
        
        expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockURL);
    });

    it('обработка пустых данных', () => {
        const emptyData: IDiagramData = {
            nodes: [],
            edges: [],
        };
        
        expect(() => exportDiagram(emptyData)).not.toThrow();
        
        const stringifySpy = jest.spyOn(JSON, 'stringify');

        exportDiagram(emptyData);
        
        expect(stringifySpy).toHaveBeenCalledWith(emptyData, null, 2);
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockURL);
    });
});

describe('Тестирование функции importDiagram:', () => {
    const validDiagramData: IDiagramData = {
        nodes: [
            {
                id: 'node-1',
                type: EShapeType.RECTANGLE,
                position: { x: 100, y: 100 },
                data: {
                    label: 'Тестовый узел 1',
                    connections: { bottom: null, top: null },
                },
            },
            {
                id: 'node-2',
                type: EShapeType.CIRCLE,
                position: { x: 300, y: 200 },
                data: {
                    label: 'Тестовый узел 2',
                    connections: { bottom: null, top: null },
                },
            }
        ],
        edges: [
            {
                id: 'edge-1',
                source: 'node-1',
                target: 'node-2',
                sourceHandle: EConnectionType.BOTTOM,
                targetHandle: EConnectionType.TOP,
            }
        ],
    };

    let mockFile: File;
    let mockFileReader: {
        readAsText: jest.Mock;
        onload: ((event: any) => void) | null;
        onerror: (() => void) | null;
        result: any;
    };
    let mockFileReaderInstance: any;

    beforeEach(() => {
        mockFile = new File([JSON.stringify(validDiagramData)], 'test.json', {
            type: 'application/json'
        });

        mockFileReader = {
            readAsText: jest.fn(),
            onload: null,
            onerror: null,
            result: null
        };

        mockFileReaderInstance = mockFileReader;

        global.FileReader = jest.fn(() => mockFileReaderInstance) as any;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('импортирование корректных данных диаграммы', async () => {
        mockFileReader.result = JSON.stringify(validDiagramData);
        
        const promise = importDiagram(mockFile);
        
        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        const result = await promise;
        
        expect(result).toEqual(validDiagramData);
        expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
    });

    it('обработка ошибки чтения файла', async () => {
        const promise = importDiagram(mockFile);
        
        mockFileReader.onerror!();
        
        await expect(promise).rejects.toThrow('Ошибка чтения файла');
    });

    it('отклонение некорректного файла', async () => {
        mockFileReader.result = '{ некорректный json }';
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow();
    });

    it('отклонение файла без поля nodes', async () => {
        const invalidData = { edges: [] };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректный формат файла диаграммы');
    });

    it('отклонение файла без поля edges', async () => {
        const invalidData = { nodes: [] };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректный формат файла диаграммы');
    });

    it('отклонение узла без id', async () => {
        const invalidData = {
            nodes: [
                {
                    type: EShapeType.RECTANGLE,
                    position: { x: 100, y: 100 },
                    data: { label: '0' }
                }
            ],
            edges: []
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректный узел на позиции 0');
    });

    it('отклонение узла без type', async () => {
        const invalidData = {
            nodes: [
                {
                    id: 'node-1',
                    position: { x: 100, y: 100 },
                    data: { label: '0' }
                }
            ],
            edges: []
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректный узел на позиции 0');
    });

    it('отклонение узла без position', async () => {
        const invalidData = {
            nodes: [
                {
                    id: 'node-1',
                    type: EShapeType.RECTANGLE,
                    data: { label: '0' }
                }
            ],
            edges: []
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректный узел на позиции 0');
    });

    it('отклонение узла без data', async () => {
        const invalidData = {
            nodes: [
                {
                    id: 'node-1',
                    type: EShapeType.RECTANGLE,
                    position: { x: 100, y: 100 }
                }
            ],
            edges: []
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректный узел на позиции 0');
    });

    it('отклонение связи без id', async () => {
        const invalidData = {
            nodes: [
                {
                    id: 'node-1',
                    type: EShapeType.RECTANGLE,
                    position: { x: 100, y: 100 },
                    data: { label: '0' }
                }
            ],
            edges: [
                {
                    source: 'node-1',
                    target: 'node-2'
                }
            ]
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректная связь на позиции 1');
    });

    it('отклонение связи без source', async () => {
        const invalidData = {
            nodes: [
                {
                    id: 'node-1',
                    type: EShapeType.RECTANGLE,
                    position: { x: 100, y: 100 },
                    data: { label: '0' }
                }
            ],
            edges: [
                {
                    id: 'edge-1',
                    target: 'node-2'
                }
            ]
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректная связь на позиции 1');
    });

    it('отклонение связи без target', async () => {
        const invalidData = {
            nodes: [
                {
                    id: 'node-1',
                    type: EShapeType.RECTANGLE,
                    position: { x: 100, y: 100 },
                    data: { label: '0' }
                }
            ],
            edges: [
                {
                    id: 'edge-1',
                    source: 'node-1'
                }
            ]
        };

        mockFileReader.result = JSON.stringify(invalidData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        await expect(promise).rejects.toThrow('Некорректная связь на позиции 1');
    });

    it('обработка пустого массива узлов и связей', async () => {
        const emptyData = {
            nodes: [],
            edges: []
        };

        mockFileReader.result = JSON.stringify(emptyData);
        
        const promise = importDiagram(mockFile);

        mockFileReader.onload!({ target: { result: mockFileReader.result } });
        
        const result = await promise;

        expect(result).toEqual(emptyData);
    });

    it('обработка ошибки при отсутствии event.target', async () => {
        mockFileReader.result = JSON.stringify(validDiagramData);
        
        const promise = importDiagram(mockFile);
        
        mockFileReader.onload!({});
        
        await expect(promise).rejects.toThrow();
    });

    it('обработка ошибки при отсутствии result', async () => {
        const promise = importDiagram(mockFile);
        
        mockFileReader.onload!({ target: {} });
        
        await expect(promise).rejects.toThrow();
    });
});