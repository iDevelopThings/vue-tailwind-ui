<template>
    <component :is="as" :href="href" @click="onClick">
        <span class="relative flex flex-row items-center " :class="{'justify-center':processing}" v-if="useSpinner">
            <Spinner :class="{'w-5 h-5' : !isSmallButton, 'w-3.5 h-3.5' : isSmallButton}" class="absolute inline-flex self-center" v-if="processing" />
            <span class="transition ease-in-out" :class="{'opacity-40' : processing}"><slot></slot></span>
        </span>
        <slot v-else></slot>
    </component>
</template>

<script lang="ts">
import {mergeDataIntoQueryString, shouldIntercept, Inertia} from "@inertiajs/inertia";
import {ref, defineComponent} from "vue";
import Spinner from "./Spinner.vue";


export default defineComponent({
    name       : "Link",
    components : {Spinner},
    props      : {
        useAxios               : {
            type    : Boolean,
            default : false,
        },
        as                     : {
            type    : String,
            default : "a",
        },
        spinner                : {
            type    : Boolean,
            default : false,
        },
        data                   : {
            type    : Object,
            default : () => ({}),
        },
        href                   : {
            type : String,
        },
        method                 : {
            type    : String,
            default : "get",
        },
        replace                : {
            type    : Boolean,
            default : false,
        },
        preserveScroll         : {
            type    : Boolean,
            default : false,
        },
        preserveState          : {
            type    : Boolean,
            default : null,
        },
        only                   : {
            type    : Array,
            default : () => [],
        },
        headers                : {
            type    : Object,
            default : () => ({}),
        },
        queryStringArrayFormat : {
            type    : String,
            default : "brackets",
        },
        after                  : {
            type    : Function,
            default : () => {
            },
        },
    },
    setup(props: any, {slots, attrs}: { slots: any, attrs: any }) {
        const as            = props.as.toLowerCase();
        const method        = props.method.toLowerCase();
        const [href, data]  = mergeDataIntoQueryString(method as any, props.href || "", props.data, props.queryStringArrayFormat);
        const processing    = ref(false);
        const isSmallButton = (attrs.class as any)?.includes("btn-sm");

        const useSpinner = props?.spinner || false;

        if (as === "a" && method !== "get") {
            console.warn(`Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<Link href="${href}" method="${method}" as="button">...</Link>`);
        }

        function onClick(event) {
            if (shouldIntercept(event)) {
                event.preventDefault();

                Inertia.visit(href, {
                    //@ts-ignore
                    usingAxios     : props.useAxios,
                    data           : data,
                    method         : method,
                    replace        : props.replace,
                    preserveScroll : props.preserveScroll,
                    preserveState  : props.preserveState ?? (method !== "get"),
                    only           : props.only,
                    headers        : props.headers,
                    onCancelToken  : attrs.onCancelToken || (() => ({})),
                    onBefore       : attrs.onBefore || (() => ({})),
                    onStart        : (() => {
                        processing.value = true;
                        if (attrs?.onStart) {
                            attrs.onStart();
                        }
                    }),
                    onProgress     : (() => {
                        if (attrs?.onProgress) {
                            attrs.onProgress();
                        }
                    }),
                    onFinish       : (() => {
                        processing.value = false;
                        if (attrs?.onFinish) {
                            attrs.onFinish();
                        }
                    }),
                    onCancel       : (() => {
                        processing.value = false;
                        if (attrs?.onCancel) {
                            attrs.onCancel();
                        }
                    }),
                    onSuccess      : ((page) => {
                        processing.value = false;
                        if (props?.after) {
                            props.after(page);
                        }
                        if (attrs?.onSuccess) {
                            attrs.onSuccess();
                        }
                    }),
                    onError        : (() => {
                        processing.value = false;
                        if (attrs?.onError) {
                            attrs.onError();
                        }
                    }),
                });
            }
        }

        return {
            onClick,
            as,
            method,
            processing,
            href,
            data,
            isSmallButton,
            useSpinner,
        };
    },
});
</script>

<style scoped>

</style>
