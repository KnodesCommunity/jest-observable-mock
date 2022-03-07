import { Observable, Subject } from 'rxjs';

import { ObservableSpy, createObservableSpy } from './observable-spy';

export type SpyObject<T> = T & {
	[key in keyof T]: T[key] extends ( ...args: any[] ) => any ?
		ObservableSpy<jest.MockedFunction<T[key]>> :
		T[key] extends Observable<infer TObs> ? Subject<TObs> : T[key]
}

export type FnKeys<T> = {
	[K in keyof T]: T[K] extends ( ...args: any[] ) => any ? K : never
}[keyof T];
export type FakeMethods<T> = {
	[key in keyof T]?: T[key] extends  ( ...args: any[] ) => any ?
		| jest.MockedFunction<( ...args: Parameters<T[key]> ) => ReturnType<T[key]>>
		| ( ReturnType<T[key]> extends Observable<infer TObs> ?
			Subject<TObs> : ReturnType<T[key]> ) :
		never;
};

export const createSpyObj = <T = any>(
	methods: Array<FnKeys<T>> | FakeMethods<T>,
	props: Partial<{[key in Exclude<keyof T, FnKeys<T>>]: T[key]}> = {} ): SpyObject<T> => {
	const obj: any = props;

	if( Array.isArray( methods ) ){
		for ( const method of methods ) {
			obj[method] = createObservableSpy();
		}
	} else {
		// eslint-disable-next-line guard-for-in -- allow inherit
		for ( const method in methods ) {
			const methodAt = methods[method] as any;
			obj[method] = createObservableSpy( typeof methodAt === 'function' && 'mock' in methodAt ? methodAt : () => methodAt );
		}
	}

	return obj;
};
