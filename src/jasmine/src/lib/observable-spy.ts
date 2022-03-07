import { Observable, Subject } from 'rxjs';

interface ObservedCalls<Fn extends jasmine.Func = jasmine.Func> extends jasmine.Calls<Fn>{
	observable: Observable<Parameters<Fn>>;
}
export interface ObservableSpy<Fn extends jasmine.Func = jasmine.Func> extends jasmine.Spy<Fn>{
	calls: ObservedCalls<Fn>;
}
export const observeCalls = <Fn extends jasmine.Func>( spy: jasmine.Spy<Fn>, originalFn?: Fn ): ObservableSpy<Fn> => {
	const obs = new Subject<Parameters<Fn>>();
	const spy2 = spy.and.callFake( ( ( ...args: Parameters<Fn> ) => {
		obs.next( args );
		return originalFn?.( ...args );
	} ) as Fn ) as ObservableSpy<Fn>;
	spy2.and.callFake = () => { throw new Error( 'Can\'t set "callFake" on a spy observed' ); };
	spy2.and.returnValue = () => { throw new Error( 'Can\'t set "returnValue" on a spy observed' ); };
	spy2.calls.observable = obs.asObservable();
	return spy2;
};
export const createObservableSpy = <Fn extends jasmine.Func>( name: string, originalFn?: Fn ): ObservableSpy<Fn> => observeCalls( jasmine.createSpy( name ), originalFn );
export const observeSpyOn = <T, K extends keyof T = keyof T>(
	// eslint-disable-next-line @typescript-eslint/ban-types -- weak types are fine here
	object: T, method: T[K] extends Function ? K : never, originalFn?: T[K] extends jasmine.Func ? T[K] : never,
): ObservableSpy<
	T[K] extends jasmine.Func ? T[K] :
	T[K] extends new ( ...args: infer A ) => infer V ? ( ...args: A ) => V : never
> => {
	const spy = spyOn( object, method );
	return observeCalls( spy, originalFn ) as any;
};
