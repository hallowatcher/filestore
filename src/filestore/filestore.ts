import { FilestoreChannels, loadFilestore } from './data/filestore-loader';
import { FileIndex, IndexId, indexIdMap } from './file-index';
import { SpriteStore } from './stores/sprite-store';
import { getFileNames } from './util/name-hash';
import { MusicStore } from './stores/music-store';
import { BinaryStore } from './stores/binary-store';
import { JingleStore } from './stores/jingle-store';
import { SoundStore } from './stores/sound-store';
import { RegionStore } from './stores/region-store';
import { ConfigStore } from './stores/config-store';
import { ModelStore } from './stores/model-store';
import { WidgetStore } from './stores/widget-store';
import { FontStore } from './stores/font-store';
import { TextureStore } from './stores/texture-store';


export let fileNames: { [ key: string ]: string | null };

export const getFileName = (nameHash: number): string | null => {
    return fileNames[nameHash.toString()] || nameHash.toString();
};


export class Filestore {

    public readonly filestoreDir: string;
    public readonly configDir: string;

    public readonly binaryStore: BinaryStore;
    public readonly configStore: ConfigStore;
    public readonly fontStore: FontStore;
    public readonly jingleStore: JingleStore;
    public readonly modelStore: ModelStore;
    public readonly musicStore: MusicStore;
    public readonly regionStore: RegionStore;
    public readonly soundStore: SoundStore;
    public readonly spriteStore: SpriteStore;
    public readonly widgetStore: WidgetStore;
    public readonly textureStore: TextureStore;

    private readonly channels: FilestoreChannels;

    private readonly indexes = new Map<number, FileIndex>();

    public constructor(filestoreDir: string, configDir?: string) {
        this.filestoreDir = filestoreDir;
        this.configDir = configDir || filestoreDir;
        this.channels = loadFilestore(filestoreDir);

        fileNames = getFileNames(this.configDir);

        this.binaryStore = new BinaryStore(this);
        this.configStore = new ConfigStore(this);
        this.fontStore = new FontStore(this);
        this.jingleStore = new JingleStore(this);
        this.modelStore = new ModelStore(this);
        this.musicStore = new MusicStore(this);
        this.regionStore = new RegionStore(this);
        this.soundStore = new SoundStore(this);
        this.spriteStore = new SpriteStore(this);
        this.widgetStore = new WidgetStore(this);
        this.textureStore = new TextureStore(this);

        this.fontStore.loadFonts();
    }

    /**
     * Fetches the specified File Index.
     * @param indexId The string or numberic ID of the File Index to find.
     */
    public getIndex(indexId: number | IndexId): FileIndex {
        if(typeof indexId !== 'number') {
            indexId = indexIdMap[indexId];
        }

        if(!this.indexes.has(indexId)) {
            const archiveIndex = new FileIndex(indexId, this.channels);
            archiveIndex.decodeIndex();
            this.indexes.set(indexId, archiveIndex);
            return archiveIndex;
        } else {
            return this.indexes.get(indexId);
        }
    }

}
