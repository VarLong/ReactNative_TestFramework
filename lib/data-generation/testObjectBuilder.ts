/*
 * Module contains definitions common for various test object builders
 */

export module testObjectBuilders {
    export class TestObjectBuilder<T> {

        public build(): T {
            return undefined;
        }

        public buildCollection(count: number = 3): T[] {
            const result: T[] = [];

            for (let i = 0; i < count; i++) {
                result.push(this.build());
            }

            return result;
        }
    }
}