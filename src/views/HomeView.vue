<template>
  <main>
    <div class="header">
      <h2>Учетные записи</h2>
      <Button outlined icon="pi pi-plus" @click="handleAddAccount" />
    </div>

    <Message severity="info" class="hint">
      <template #icon>
        <i class="pi pi-question"></i>
      </template>
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель
      <code>;</code></Message
    >

    <div class="row header-row">
      <span class="cell tags">Метки</span>
      <span class="cell type">Тип</span>
      <span class="cell login">Логин</span>
      <span class="cell password">Пароль</span>
      <span class="cell delete"></span>
    </div>

    <AccountRow v-for="account in accountStore.accounts" :key="account.id" :account="account" />
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/account.ts'
import AccountRow from '@/components/AccountRow.vue'

const accountStore = useAccountStore()
accountStore.initDefaultAccount()

const handleAddAccount = () => {
  accountStore.addAccount()
}
</script>

<style scoped>
main {
  max-width: 786px;
  margin: 0 auto;
}

.header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 10px;

  color: #171717;
}

.hint {
  font-size: 13px;
  color: #575757;
  margin-bottom: 1rem;
}

.row {
  display: flex;
  gap: 16px;
  margin-bottom: 0.5rem;
  align-items: center;

  color: #575757;
}

.cell {
  flex-shrink: 0;
}

.tags {
  /** input width */
  flex-basis: 186px;
}
.type {
  /** input width */
  flex-basis: 140px;
}
.login {
  /** input width */
  flex-basis: 186px;
}
.password {
  /** input width */
  flex-basis: 214px;
}

.delete {
  width: 2rem;
}
</style>
