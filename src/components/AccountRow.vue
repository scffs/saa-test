<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Button from 'primevue/button'

import { type Account, useAccountStore } from '@/stores/account.ts'

const props = defineProps<{ account: Account }>()
const store = useAccountStore()

const editable = ref({ ...props.account })
const loginError = ref(false)
const passwordError = ref(false)
const tagsInput = ref('')

onMounted(() => {
  tagsInput.value = props.account.tags.map((t) => t.text).join(';')
})

const tagError = ref(false)

const validateAndSave = () => {
  loginError.value = !editable.value.login || editable.value.login.length > 100

  passwordError.value =
    editable.value.type === 'Локальная' &&
    (!editable.value.password || editable.value.password.length > 100)

  const parsedTags = tagsInput.value
    .split(';')
    .map((tag) => tag.trim())
    .filter(Boolean)

  tagError.value = !parsedTags.length || parsedTags.some((tag) => tag.length > 50)

  if (loginError.value || passwordError.value || tagError.value) {
    return
  }

  const tagObjects = parsedTags.map((text) => ({ text }))

  const accountToSave: Account = {
    ...editable.value,
    tags: tagObjects,
    password: editable.value.type === 'LDAP' ? null : editable.value.password,
  }

  store.updateAccount(accountToSave)
}

watch(
  () => editable.value.type,
  (type) => {
    if (type === 'LDAP') {
      editable.value.password = null
    }
    validateAndSave()
  },
)

const onBlur = () => validateAndSave()
const removeAccount = () => store.deleteAccount(props.account.id)
</script>

<template>
  <div class="row">
    <InputText
      v-model="tagsInput"
      placeholder="Метки"
      @blur="onBlur"
      :class="['cell tags', { 'p-invalid': tagError }]"
      :inputClass="{ 'p-invalid': tagError }"
    />

    <Select
      v-model="editable.type"
      :options="['Локальная', 'LDAP']"
      @change="validateAndSave"
      class="cell type"
    />

    <InputText
      v-model="editable.login"
      placeholder="Логин"
      :class="[
        'cell login',
        editable.type === 'LDAP' ? 'ldap-expand' : '',
        { 'p-invalid': loginError },
      ]"
      @blur="onBlur"
    />

    <template v-if="editable.type === 'Локальная'">
      <Password
        v-model="editable.password"
        placeholder="Пароль"
        :class="['cell password', { 'p-invalid': passwordError }]"
        @blur="onBlur"
        toggleMask
      />
    </template>

    <Button icon="pi pi-trash" severity="danger" text class="cell delete" @click="removeAccount" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cell {
  flex-shrink: 0;
}

.type {
  flex-basis: 140px;
  max-width: 140px;
}

.ldap-expand {
  flex-basis: calc(186px + 214px + 16px); /* login + password + gap */
}

.password:empty {
  display: inline-block;
}

.delete {
  width: 2rem;
}
</style>
