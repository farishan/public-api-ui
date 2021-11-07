import { writable } from 'svelte/store';

export const selectedCategories = writable([]);
export const addSelectedCategory = (value) => {
  selectedCategories.update((arr) => [...arr, value]);
};
export const removeSelectedCategory = (value) => {
  let newArray = [];

  selectedCategories.subscribe((arr) => {
    newArray = [...arr];
  });

  newArray.splice(newArray.indexOf(value), 1);
  selectedCategories.set(newArray);
};

export const entries = writable([]);
