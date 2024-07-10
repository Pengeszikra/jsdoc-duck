# jsdoc-duck
jsdoc-duck is a minimalist library that helps organize mid-complex state handling with type-guarded dispatch-capable actions. It leverages `useReducer` and jsDoc/Javascript to bring type safety and structure to your application's state management.
It is based on [react-state-factory](https://www.npmjs.com/package/react-state-factory).
The big difference is for simplicity reason don't included useStateReducer counterpart.

> this library is also useful for react/typescript application in same way as react-state-factory short example will included

## Installation

```sh
npm add jsdoc-duck
```

## TLDR
Just define the actions and state then useDuck give back your typed state and quack with list of actions.

## jsDoc/JS example

```js
/**
 * @typedef {{type: "FOO", payload: string[] }} FOO
 * @typedef {{type: "FUU", payload: number }} FUU
 * @typedef { FOO | FUU } ActionsMap
 */
 
/** @type {import('/jsdoc-duck').Labels<ActionsMap>} */ 
const labels = {
  FOO: "FOO",
  FUU: "FUU",
}

/** @typedef {{foo: string[], fuu: number}} FooState */

/** @type {import('jsdoc-duck').Reducer<ActionsMap, FooState>} */
export const fooReducer = (state, { type, payload }) => {
  switch (type) {
    case labels.FOO: return {...state, foo: [...foo, payload]}
    case labels.FUU: return {...state, fuu: payload}
    default: return state;
  }
}

/** @type FooState */
export const fooSetup = {
  foo: ['this is a real minimal foo application', 'are create tokens'],
  fuu: 42
}

export const FooAndFuuComponent = () => {
  const [state, quack] = useDuck(fooReducer, fooSetup, labels);

  const addToken = () => {
    const rnd = Math.random()
    const token = rnd.toString(36).toUpperCase().slice(-7);
    quack.FOO(token);
    quack.FUU(rnd);
  };

  return (
    <pre onClick={addToken}>{JSON.stringify(state, null, 2)}</pre>
  )
```

## Use Case - React Poker Game
This example are under development, and there are just paste the relevant code parts,
I would like create a mid-complex application which is a bit complex than casual counter application,
where this small library ( less than 100 LOC ) can show the usability of `typed useReducer`

> First of all I create a AM - ActionsMap which is holding group actions with united typedefs
```js
/**
 * @typedef {{ type: "SUMMON", payload: Player[] }} SUMMON
 * @typedef {{ type: "DECK", payload: [string, string][] }} DECK
 * @typedef {{ type: "NEW_GAME", payload: Player }} NEW_GAME - dealer
 * @typedef {{ type: "BLINDS", payload: number | string }} BLINDS - blinds name or index
 * @typedef {{ type: "DEALING", payload:  null }} DEALING
 * @typedef {{ type: "PRE_FLOP", payload: string }} PRE_FLOP
 * @typedef {{ type: "FLOP", payload: string }} FLOP
 * @typedef {{ type: "TURN", payload: number }} TURN
 * @typedef {{ type: "RIVER", payload: string }} RIVER
 * @typedef {{ type: "SHOWDOWN", payload: string }} SHOWDOWN
 * @typedef {{ type: "CALL", payload: string }} CALL
 * @typedef {{ type: "RAISE", payload: string }} RAISE
 * @typedef {{ type: "FOLD", payload: string }} FOLD
 * @typedef {{ type: "CHECK", payload: string }} CHECK
 * @typedef {{ type: "NEXT_HAND", payload: string }} NEXT_HAND
 * @typedef {{ type: "ESCAPE", payload: string }} ESCAPE
 * @typedef {{ type: "CHAMPION_ARE", payload: string }} CHAMPION_ARE
 * @typedef {{ type: "CALC_RANK", payload: null }} CALC_RANK
 *
 * @typedef { DECK | SUMMON | NEW_GAME | BLINDS | DEALING | PRE_FLOP | FLOP | TURN | RIVER | SHOWDOWN | CALL | RAISE | FOLD | CHECK | NEXT_HAND | ESCAPE | CHAMPION_ARE | CALC_RANK } ActionsMap
 */
```

> This is a autogenerated actionsMap aka Labels
```js
/** @type {import('/jsdoc-duck').Labels<ActionsMap>} */ 
const actionsMap = {
  DECK: "DECK",
  SUMMON: "SUMMON",
  NEW_GAME: "NEW_GAME",
  BLINDS: "BLINDS",
  DEALING: "DEALING",
  PRE_FLOP: "PRE_FLOP",
  FLOP: "FLOP",
  TURN: "TURN",
  RIVER: "RIVER",
  SHOWDOWN: "SHOWDOWN",
  CALL: "CALL",
  RAISE: "RAISE",
  FOLD: "FOLD",
  CHECK: "CHECK",
  NEXT_HAND: "NEXT_HAND",
  ESCAPE: "ESCAPE",
  CHAMPION_ARE: "CHAMPION_ARE",
  CALC_RANK: "CALC_RANK"
};
```

> State of game is a simple jsDoc @typedef
```js
/**
 * @typedef {{
 *  players: Player[],
 *  phase: string,
 *  dealer: Player,
 *  deck: [string, string][],
 *  rate: Rate[],
 *  button: string,
 * }} TexasHolden
*/
```

> Reducer cointains the core logic of game
```js
/** @type {import('jsdoc-duck').Reducer<ActionsMap, TexasHolden>} */
export const pokerReducer = (state, { type, payload }) => {
  switch (type) {
    case actionsMap.DECK: return {...state, deck: payload };
    case actionsMap.SUMMON: return {...state, players: payload };
    case actionsMap.NEW_GAME: return {...state, dealer: payload };
    case actionsMap.FLOP: return {...state, phase: FLOP, foo: payload };
    case actionsMap.CALC_RANK: return {...state, rank: rankCalc(state.players, state.dealer)}
    case actionsMap.DEALING: {
      const {deck} = state;
      return {
        ...state,
        phase: actionsMap.DEALING,
        players: state.players.map(player => ({...player, hand: [...player.hand, deck.shift()] })),
        deck
      }
    }
    default: return state;
  }
}
```

> Finally the Poker component with `useDuck` a dispatchable actions list.
```js
export const Poker = () => {
  // poker, and quack of course in array destruction, so you can give any name which is fit for your component.
  const [poker, quack] = useDuck(pokerReducer, pokerSetup, actionsMap);

  useEffect(() => {
    const deck = aRandomDeck();
    quack.DECK(deck);
    quack.SUMMON(
      "Andy|Boris|Medar|Oriana".split("|").map(name => ({ name, hand: [], coin: 1000 }))
    );
    quack.BLINDS(0);
    quack.NEW_GAME({ name: '- dealer -', hand: [], coin: 0 });
    quack.DEALING();
    quack.DEALING();
    quack.CALC_RANK();
  }, []);

  return (
    <pre>{JSON.stringify(poker, null, 2)}</pre>
  )
```


