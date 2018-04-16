<template>
    <Modal v-model="isShow" :footerHide="true" :mask-closable="false" :width="modalWidth + 70" :height="modalHeight"

           @on-ok="ok"
            @on-cancel="cancel">
        <audio ref="audio" :src="source" :width="modalWidth" :height="modalHeight" autoplay controls preload></audio>
    </Modal>
</template>
<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            recordSrc: {
                type: String,
                default: null
            },
            modalWidth: {
                type: Number,
                default: 300
            },
            modalHeight: {
                type: Number,
                default: 32
            }
        },
        data() {
            return {
                isShow: this.show,
                source: this.src,
                audio: null
            }
        },
        watch: {
            recordSrc(val) {
                this.source = val;
            },
            show(val) {
                this.isShow = val;
                if (val) {
                    this.play();
                }
            }
        },
        methods: {
            ok: function () {
                this.pause();
                this.$emit("on-record-ok");
            },
            cancel: function () {
                this.pause();
                this.$emit("on-record-cancel");
            },
            play: function () {
                let audio = this.$refs.audio;
                if(audio.paused || audio.ended) {
                    audio.load();
                }
            },
            pause: function () {
                let audio = this.$refs.audio;
                if(!audio.paused && !audio.ended) {
                    audio.pause();
                }
            }
        }
    }
</script>