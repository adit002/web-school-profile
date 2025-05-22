<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  color: {
    type: String,
    default: 'blue',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  return [
    'rounded-md py-2 px-3  focus:outline-none h-9',
    getColorClass(),
    getSizeClass(),
    {
      'cursor-not-allowed opacity-50': props.disabled,
    },
  ]
})

function getColorClass() {
  switch (props.color) {
    case 'blue-shadow':
      return 'bg-foreground text-white shadow-button_shadow'
    case 'red-outlined':
      return 'border border-danger-default bg-danger-50 border-2'
    case 'red':
      return 'bg-danger-50'
    case 'green':
      return 'bg-success-50 text-success-default hover:bg-success-default hover:text-white'
    case 'bold-green':
      return 'bg-green font-semibold text-white'
    case 'light-white':
      return 'bg-lightwhite'
    case 'mild-blue':
      return 'bg-mildblue font-semibold'
    case 'blue':
    default:
      return 'bg-foreground text-white'
  }
}

function getSizeClass() {
  switch (props.size) {
    case 'sm':
      return 'text-sm'
    case 'lg':
      return 'text-lg'
    case 'md':
    default:
      return 'text-base'
  }
}

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button :class="buttonClasses" :type="props.type" :disabled="props.disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>
