<script setup>

import {computed} from "vue";
import {useRouter} from "vue-router";

import useIamStore from "../../application/iam.store.js";

const router = useRouter();

const store = useIamStore();

const isSignedIn = computed(() => {
  return store.isSignedIn;
});

const currentUser = computed(() => store.currentUser);

function performSignOut() {

  store.signOut(router);
}

</script>

<template>

  <div class="flex align-items-center gap-3">

    <template v-if="isSignedIn">

            <span>
                {{ currentUser?.fullName || 'Usuario' }}
            </span>

      <pv-button
          label="Sign Out"
          severity="secondary"
          outlined
          @click="performSignOut"
      />

    </template>

    <template v-else>

      <pv-button
          label="Sign In"
          @click="router.push('/iam/sign-in')"
      />

    </template>

  </div>

</template>