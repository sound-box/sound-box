import { Paginated } from '@feathersjs/feathers';
import { NFCTag } from '@leek/commons/';
import { uniq } from 'lodash';
import { computed, ComputedRef, Ref, ref } from 'vue';

import ListItem from '../components/uiBlocks/Dropdown.ListItem';
import feathers from './useBackend';

const tagService = feathers.service('nfc-tags');
let areTagsListenerLoaded = false;

export const tagGroupListItems = ref<ListItem[]>([]);
export const tags = ref<NFCTag[]>([]);

export async function loadTagGroups(): Promise<void> {
  const allTags = (await tagService.find()) as Paginated<NFCTag>;
  const tagGroupNames = uniq(allTags.data.map((tag: NFCTag) => tag.group));
  tagGroupListItems.value = tagGroupNames.map((groupName: string) => new ListItem(groupName));
}

export type NFCTagGroup = {
  name: string;
  tags: NFCTag[];
};

export const tagsOrderedByGroups = computed(() =>
  Object.values(
    tags.value.reduce((previous, item) => {
      if (!previous[item.group]) {
        previous[item.group] = { name: item.group, tags: [] } as NFCTagGroup;
      }
      previous[item.group].tags.push(item);
      return previous;
    }, {} as Record<string, NFCTagGroup>)
  )
);

export async function loadTags(): Promise<void> {
  const res = (await tagService.find()) as Paginated<NFCTag>;
  tags.value = res.data;

  if (!areTagsListenerLoaded) {
    areTagsListenerLoaded = true;

    tagService.on('removed', (tag: NFCTag): void => {
      tags.value = tags.value.filter((_tag) => _tag._id !== tag._id);
    });

    tagService.on('created', (tag: NFCTag): void => {
      tags.value = [...tags.value, tag];
    });
  }
}

export const getIsNfcTagValid = (nfcTag: Ref<NFCTag | undefined>): ComputedRef<boolean> =>
  computed(() => {
    if (!nfcTag.value) {
      return false;
    }

    const tag = nfcTag.value;
    return !!(tag.nfcData && tag.name && tag.group && tag.trackUri && tag.imageUrl);
  });
