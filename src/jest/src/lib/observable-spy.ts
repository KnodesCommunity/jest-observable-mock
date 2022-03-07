import { Observable, Subject } from 'rxjs';

/** @deprecated */
export type ObservableMock<Mock extends jest.MockInstance<any, any>> = ObservableSpy<Mock>
export type ObservableSpy<Mock extends jest.MockInstance<any, any> = jest.MockInstance<any, any>> = Mock extends jest.MockInstance<infer T, infer Y> ?
	Mock & {calls$: Observable<Y>; rets$: Observable<T>} :
	never;
type MockParams<Mock> = Mock extends jest.MockInstance<any, infer Y> ? Y : never;
type MockReturn<Mock> = Mock extends jest.MockInstance<infer T, any> ? T : never;
export const observeCalls = <Mock extends jest.MockInstance<any, any>>( spy: Mock ): ObservableSpy<Mock> => {
	const obsCalls = new Subject<MockParams<Mock>>();
	const obsRets = new Subject<MockReturn<Mock>>();
	const wrapFn = ( baseFn?: ( ...args: MockParams<Mock> ) => MockReturn<Mock> ) =>
		( ...args: MockParams<Mock> ) => {
			obsCalls.next( args );
			if( baseFn ){
				const ret = baseFn( ...args );
				obsRets.next( ret );
				return ret;
			} else {
				return undefined as MockReturn<Mock>;
			}
		};
	const baseMockImpl = spy.mockImplementation.bind( spy );
	const baseMockImplOnce = spy.mockImplementationOnce.bind( spy );
	const spy2 = baseMockImpl( wrapFn( spy.getMockImplementation() ) ) as ObservableSpy<Mock>;
	spy2.mockImplementation = ( fn: ( ...args: MockParams<Mock> ) => MockReturn<Mock> ) => {
		baseMockImpl( wrapFn( fn ) );
		return spy2;
	};
	spy2.mockImplementationOnce = ( fn: ( ...args: MockParams<Mock> ) => MockReturn<Mock> ) => {
		baseMockImplOnce( wrapFn( fn ) );
		return spy2;
	};
	spy2.mockRejectedValue = ( v: MockReturn<Mock> ) => {
		baseMockImpl( wrapFn( () => Promise.reject( v ) as any ) );
		return spy2;
	};
	spy2.mockRejectedValueOnce = ( v: MockReturn<Mock> ) => {
		baseMockImplOnce( wrapFn( () => Promise.reject( v ) as any ) );
		return spy2;
	};
	spy2.mockResolvedValue = ( v: MockReturn<Mock> ) => {
		baseMockImpl( wrapFn( () => Promise.resolve( v ) as any ) );
		return spy2;
	};
	spy2.mockResolvedValueOnce = ( v: MockReturn<Mock> ) => {
		baseMockImplOnce( wrapFn( () => Promise.resolve( v ) as any ) );
		return spy2;
	};
	spy2.mockReturnValue = ( v: MockReturn<Mock> ) => {
		baseMockImpl( wrapFn( () => v as any ) );
		return spy2;
	};
	spy2.mockReturnValueOnce = ( v: MockReturn<Mock> ) => {
		baseMockImplOnce( wrapFn( () => v as any ) );
		return spy2;
	};
	spy2.calls$ = obsCalls.asObservable();
	spy2.rets$ = obsRets.asObservable();
	return spy2;
};
export const createObservableSpy = <Fn extends jest.Mock>( fn?: ( ...args: MockParams<Fn> ) => MockReturn<Fn> ): ObservableSpy<Fn> =>
	observeCalls( typeof fn === 'function' && '_isMockFunction' in fn && ( fn as any )._isMockFunction ? fn : jest.fn( fn ) as Fn );

// eslint-disable-next-line @typescript-eslint/ban-types -- expected.
type NonNullish = {};

export const observeSpyOn: {
	<T extends NonNullish, M extends jest.NonFunctionPropertyNames<Required<T>>>(
		object: T,
		method: M,
		accessType: 'get'
	): ObservableSpy<jest.SpyInstance<Required<T>[M], []>>;
	<T extends NonNullish, M extends jest.NonFunctionPropertyNames<Required<T>>>(
		object: T,
		method: M,
		accessType: 'set'
	): ObservableSpy<jest.SpyInstance<void, [Required<T>[M]]>>;
	<T extends NonNullish, M extends jest.FunctionPropertyNames<Required<T>>>(
		object: T,
		method: M
	): Required<T>[M] extends ( ...args: any[] ) => any
		? ObservableSpy<jest.SpyInstance<ReturnType<Required<T>[M]>, jest.ArgsType<Required<T>[M]>>>
		: never;
	<T extends NonNullish, M extends jest.ConstructorPropertyNames<Required<T>>>(
		object: T,
		method: M
	): Required<T>[M] extends new ( ...args: any[] ) => any
		? ObservableSpy<jest.SpyInstance<InstanceType<Required<T>[M]>, jest.ConstructorArgsType<Required<T>[M]>>>
		: never;
} = ( object: any, method: string, accessType?: 'get' | 'set' ) => {
	const spy = jest.spyOn( object, method, accessType as any );
	return observeCalls( spy ) as any;
};
