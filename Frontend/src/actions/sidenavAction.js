/* eslint-disable import/prefer-default-export */
import { GET_ACTIVEGROUPS_DATA, GET_INVITES_DATA } from "../constants/actionTypes";

export function getActiveGroupsData(payload) {
  return { type: GET_ACTIVEGROUPS_DATA, payload };
}

export function getInvitesData(payload) {
  return { type: GET_INVITES_DATA, payload };
}
