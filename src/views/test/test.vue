<template>
    <!-- <finalcontact></finalcontact> -->
    <!-- <sendemail></sendemail> -->
    <!-- <SlidingMenu></SlidingMenu> -->
    <div>
        <div @mouseover="function() {show = true}" @mouseout="function() {show = false}">

            <div style="right: 15px;position: relative" v-show="show">
                <!--<ButtonGroup>-->
                    <Button type="ghost">
                        <i class="icon icon-bussinessman"></i>
                    </Button>

                    <Poptip trigger="hover">
                        <div>
                            <Button type="ghost">
                                <i class="icon icon-phone1"></i>
                                <div style="width:18px;height: 18px;border:1px solid #ddd;border-radius: 9px;
                                position: absolute;top:1px;right:1px;">25
                                </div>
                            </Button>
                        </div>
                        <div slot="content">
                            <div>手机号码</div>
                            <div>联系电话</div>
                        </div>
                    </Poptip>

                    <Button type="ghost">
                        <i class="icon icon-comments"></i>
                    </Button>
                    <Button type="ghost">
                        <i class="icon icon-luyin1"></i>
                    </Button>
                    <Button type="ghost">
                        <i class="icon icon-weixin1"></i>
                    </Button>
                <!--</ButtonGroup>-->
            </div>

            <div style="">
                <i class="icon icon-caozuo-zhankai" style="cursor: pointer"></i>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                show: false,
            }
        }
    }
</script>
