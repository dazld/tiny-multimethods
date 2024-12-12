// index.d.ts

/**
 * Symbol used to define default method implementations
 */
export declare const DEFAULT: unique symbol;

/**
 * A dispatch function that determines which method implementation to use
 * @typeparam T - The input type for the multimethod
 * @typeparam K - The type of the dispatch value (should be suitable as a Map key)
 */
export type DispatchFn<T, K> = (value: T) => K;

/**
 * A method implementation for a specific dispatch value
 * @typeparam T - The input type for the multimethod
 * @typeparam R - The return type of the method
 */
export type MethodImplementation<T, R> = (value: T) => R;

/**
 * A method definition tuple containing a dispatch value and implementation
 * @typeparam T - The input type for the multimethod
 * @typeparam K - The type of the dispatch value
 * @typeparam R - The return type of the method
 */
export type MethodDefinition<T, K, R> = [K, MethodImplementation<T, R>];

/**
 * A multimethod function that includes an addMethod function for runtime extension, and a function for discovering
 * available methods.
 * @typeparam T - The input type for the multimethod
 * @typeparam R - The return type of the methods
 */
export interface Multimethod<T, R> {
    (value: T): R;
    addMethod(dispatchValue: any, implementation: MethodImplementation<T, R>): void;
    addMethod(definition: MethodDefinition<T, any, R>): void;
    methods(): any[];
}

/**
 * Creates a new multimethod using the provided dispatch function and method implementations
 * @param dispatchFn - Function that takes an argument and returns a dispatch value
 * @param methods - Array of [dispatchValue, implementation] pairs
 * @returns A function that will dispatch to the appropriate method based on the dispatch function's result
 *
 * @example
 * ```typescript
 * interface Shape {
 *   type: 'circle' | 'rectangle';
 *   radius?: number;
 *   width?: number;
 *   height?: number;
 * }
 *
 * const calculateArea = defmulti<Shape, number>(
 *   shape => shape.type,
 *   ['circle', shape => Math.PI * shape.radius! ** 2],
 *   ['rectangle', shape => shape.width! * shape.height!],
 *   [DEFAULT, shape => {
 *     throw new Error(`Can't calculate area of ${shape.type}`);
 *   }]
 * );
 * ```
 */
export declare function defmulti<T, R>(
    dispatchFn: DispatchFn<T, any>,
    ...methods: MethodDefinition<T, any, R>[]
): Multimethod<T, R>;
