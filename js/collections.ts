
interface Base<T> {
}

interface LoopFunction<T> {
    (a: T, index: number): boolean | void;
}

interface Collection<T> {
    add(item: T, index?: number): boolean;
    nodeIndex(index: number): Base<T>;
    toArray(): T[];
    remove(index: Number): void;
    clear(): void;
    forEach(callback: LoopFunction<T>): void;
} 
