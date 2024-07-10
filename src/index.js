/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/no-undefined-types */
import { useMemo, useReducer, Dispatch } from "react";

/**
 * @module jsdoc-duck
 * @author peter.vivo <vivo.peter@protonmail.com>
 */

/**
 * @template T - Payload Type
 * @typedef {T extends { type: infer U, payload: infer P } ? { type: U, payload: P } : never} ActionType
 */

/**
 * @template AM - Actions Map
 * @typedef {{ [K in AM['type']]: K }} Labels
 */

/**
 * @template AM - Actions Map
 * @template EM - Labels
 * @typedef {{ [T in keyof EM]: (payload: Extract<ActionType<AM>, { type: T }>["payload"]) => void }} TypedActionMap
 */

/**
 * @template ST - State
 * @template AM - Actions Map
 * @typedef {(state: ST, action: AM) => ST} Reducer
 */

/**
 * TypedActionMap creates a map of action type to action creator function.
 * @template AM - Actions Map
 * @template EM - Lables<AM>
 * @typedef {{ [T in keyof EM]: (payload: Extract<ActionType<AM>, { type: T }>["payload"]) => void }} TypedActionMap
 */

/**
 * Factory function to create a typed action map.
 * @template AM - Actions Map
 * @param {Labels<AM>} keys - The keys representing action labels.
 * @param {Dispatch<AM>} dispatch - The dispatch function for actions.
 * @return {TypedActionMap<AM, Labels<AM>>} The resulting typed action map.
 */
function typedActionMapFactory(keys, dispatch) {
  return Object.keys(keys).reduce((acc, type) => ({
    ...acc,
    [type]: (payload) => {
      dispatch({ type, payload });
    }
  }), {});
}

/**
 * A factory hook to create a state and a typed dispatch functions\
 * @exports useDuck
 * @template AM - Actions Map
 * @template ST - State Typer
 * @template PT - Labels of actions 
 * @param {(st: ST, action: AM) => ST} reducer - The reducer function to manage the state.
 * @param {ST} initialState - The initial state value.
 * @param {PT} labels - The labels for the actions.
 * @return {[ST, TypedActionMap<AM, PT>]} The current state and a map of action dispatch functions.
 */
export const useDuck = (reducer, initialState, labels) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const qwak = useMemo(
    () => typedActionMapFactory(labels, dispatch), [dispatch, labels]
  );
  return ([state, qwak]);
};