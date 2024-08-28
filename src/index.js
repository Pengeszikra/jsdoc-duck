// @ts-check-almost-fine-expect-on-reducer-where-good-result-are-created-on-last-round
// -- equal --
// @ts-nocheck

import { useMemo, useReducer } from "react";

/**
 * @module jsdoc-duck
 * @author peter.vivo
 */

/**
 * @template T - Payload Type
 * @typedef {T extends { type: infer U, payload?: infer P } ? { type: U, payload?: P } : never} ActionType
 */

// @ts-ignore
/** @template AM - Actions Map @typedef {{ [K in AM['type']]: K }} Labels */

// @ts-ignore
/** @template AM - Actions Map @typedef {{ [T in AM["type"]]: Extract<AM, { type: T }> extends { payload: infer P } ? (payload: P) => void : () => void }} Quack */

/**
 * @template ST - State
 * @template AM - Actions Map
 * @typedef {(state: ST, action: AM) => ST} Reducer
 */

/**
 * Factory function to create a typed action map.
 * @template AM - Actions Map
 * @param {Labels<AM>} labelsObject - The keys representing action labels.
 * @param {function} dispatch - The dispatch function for actions.
 * @return {Quack<AM>} The resulting typed action map.
 */
export const quackFactory = (labelsObject, dispatch) => Object
  .keys(labelsObject)
  .reduce(
    /**
     * @arg {Quack<AM>} acc
     * @arg {keyof Labels<AM>} type
     * @return {Quack<AM>}
     */
    (acc, type) => ({
    ...acc,
    [type]: (payload) => {dispatch({ type, payload });}
  }), {});

/**
 * A factory hook to create a state and a typed dispatch functions\
 * @exports useDuck
 * @template AM - Actions Map
 * @template ST - State Typer
 * @param {(st: ST, action: AM) => ST} reducer - The reducer function to manage the state.
 * @param {ST} initialState - The initial state value.
 * @return {[ST, Quack<AM>]} The current state and a map of action dispatch functions.
 */
export const useDuck = (reducer, initialState, labels) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const quack = useMemo(
    () => quackFactory(labels, dispatch),
    [dispatch, labels]
  );
  return ([state, quack]);
};