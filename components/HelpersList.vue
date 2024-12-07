<template>
    <div class="grid grid-cols-4 gap-3 mx-auto py-2">
        <div v-for="item in items" :key="item.label" class="underline text-primary font-medium">
            <a :href="item.href || ''">
                {{ item.label }}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ListComponent',
    props: {
        items: {
            type: Array,
            required: true,
            validator: (value) => {
                return value.every(item =>
                    typeof item === 'object' &&
                    'label' in item
                );
            }
        }
    }
}
</script>