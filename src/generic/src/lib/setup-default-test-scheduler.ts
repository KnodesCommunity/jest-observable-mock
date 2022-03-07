import { Subscription } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';

import { ColdMarble } from './marble/cold-marble';

import { IExtendedTestScheduler, MarbleHelpers } from './types';

export const buildMarbleHelper = ( helpers: RunHelpers, registerSub: ( sub: Subscription ) => void = () => void 0 ): MarbleHelpers => {
	const marble: MarbleHelpers = ( ( timeline: string, values?: Record<string, any> ) => new ColdMarble( marble, timeline, values ) ) as any;
	Object.assign( marble, {
		...helpers,
		registerSubscription: registerSub,
		triggerOn: ( subscriber, marbles, values, error ) =>
			marble.registerSubscription( helpers.cold( marbles, values, error ).subscribe( typeof subscriber === 'function' ? { next: subscriber } : subscriber ) ),
	} as Partial<MarbleHelpers> );
	return marble;
};
export const setupDefaultTestScheduler = (
	assert: <T>( actual: T, expected: T ) => void = ( actual, expected ) => expect( actual ).toEqual( expected ),
): IExtendedTestScheduler => {
	let scheduler: TestScheduler;
	beforeEach( () => {
		scheduler = new TestScheduler( assert );
	} );

	const subscriptions: Subscription[] = [];
	afterEach( () => {
		scheduler.flush();
		subscriptions
			.splice( 0, subscriptions.length )
			.forEach( s => s.unsubscribe() );
	} );
	const registerSubscription = ( sub: Subscription ) => {
		subscriptions.push( sub );
	};

	const wrapFnAddRunHelper = ( fn: ( helpers: MarbleHelpers ) => void ) => ( helpers: RunHelpers ) => {
		const extraHelpers = buildMarbleHelper( helpers );
		fn( extraHelpers );
	};
	const ret: IExtendedTestScheduler = {
		get: () => scheduler,
		run: ( fn: ( marble: MarbleHelpers ) => void ) =>
			scheduler.run( wrapFnAddRunHelper( fn ) ),
		test: <TArgs extends any[]>( fn: ( marble: MarbleHelpers, ...args: TArgs ) => void ) =>
			( ...args: TArgs ) => ret.run( h => fn( h, ...args ) ),
		registerSubscription,
	};
	return ret;
};
