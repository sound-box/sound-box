import { User } from '@leek/commons';
import { computed, ref } from 'vue';

import feathers from '../lib/feathers';

export const user = ref<User | null>(null);

export const isAuthenticated = computed(() => !!user.value);

export async function load() {
  try {
    await feathers.reAuthenticate();
    user.value = (await feathers.get('authentication')).user;
  } catch (ignore) {
    // this error can be ignored
  }
}

export async function logout() {
  feathers.logout();
  user.value = null;
}
