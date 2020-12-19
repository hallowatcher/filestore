import { CacheChannel, loadCacheChannels } from './fs/channels';
import { ArchiveIndex, IndexId, indexIdMap } from './archive-index';
import { SpriteStore } from './stores/sprite-store';
import { getFileNames } from './util/name-hash';


export let fileNames: { [ key: string ]: string | null } = getFileNames('cache'); // @TODO configurable

export const getFileName = (nameHash: number): string | null => {
    return fileNames[nameHash.toString()] || nameHash.toString();
};


export class Filestore {

    public readonly filestoreDir: string;
    public readonly configDir: string;
    public readonly spriteStore = new SpriteStore(this);
    private readonly channels: CacheChannel;
    private readonly indexes = new Map<number, ArchiveIndex>();

    public constructor(filestoreDir: string, configDir: string) {
        this.filestoreDir = filestoreDir;
        this.configDir = configDir;
        this.channels = loadCacheChannels(filestoreDir);
        fileNames = getFileNames(configDir);
    }

    public getIndex(indexId: number | IndexId): ArchiveIndex {
        if(typeof indexId !== 'number') {
            indexId = indexIdMap[indexId];
        }

        if(!this.indexes.has(indexId)) {
            const archiveIndex = new ArchiveIndex(indexId, this.channels);
            archiveIndex.decodeIndex();
            this.indexes.set(indexId, archiveIndex);
            return archiveIndex;
        } else {
            return this.indexes.get(indexId);
        }
    }

    public getSpriteIndex(): ArchiveIndex {
        return this.getIndex(5);
    }

    public getBinaryIndex(): ArchiveIndex {
        return this.getIndex(10);
    }

}