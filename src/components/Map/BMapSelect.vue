<!--
 * @Description: 百度地图选址组件
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-09 16:22:16
-->
<template>
  <div class="w-full">
    <el-input
      v-if="showInput"
      :validate-event="false"
      type="text"
      readonly
      placeholder="请输入"
      v-model="addressInfo.address"
      style="width: 100%"
      @click="show" />
    <el-dialog v-model="openMap" class="zh-dialog" title="位置选择" append-to-body width="70%" :close-on-click-modal="false" destroy-on-close>
      <el-form label-width="80px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="当前地点">
              <el-input size="small" type="text" id="suggestId" v-model="addressInfo.address" placeholder="请输入地点" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="位置经度">
              <el-input size="small" type="text" v-model="addressInfo.longitude" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="位置纬度">
              <el-input size="small" type="text" v-model="addressInfo.latitude" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="baidu" id="baidumap" style="width: 100%; height: 300px" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { BMPGL } from "@/utils/loadMap";
import { onMounted, watch, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
//////////////////////////////////////////////////////////////////////////////////
defineOptions({
  name: "bMap",
});
const props = defineProps({
  modelValue: [Object, String],
  showInput: {
    // 是否以input形式展示
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["confirmMapAddress", "update:modelValue"]);
//#region ----变量等------------------------------------------------------------------
const bmap_ak = import.meta.env.VITE_BMAP_KEY;
//#endregion ========================================================================
//////////////////////////////////////////////////////////////////////////////////
//#region ----初始化,生命周期等-------------------------------------------------------
const map = ref(null);
const mapZoom = ref(15);
const ak = ref(bmap_ak);
const openMap = ref(false);
const addressInfo = reactive({
  // 地址信息
  longitude: "", // 经度
  latitude: "", // 纬度
  province: "", // 省
  city: "", // 市
  district: "", // 区
  address: "", // 详细地址
});
watch(
  () => [openMap],
  () => {
    if (!openMap.value) {
      map.value && map.value.destroy();
    }
  },
  { deep: true },
);

onMounted(() => {
  if (typeof props.modelValue === "object") {
    addressInfo.address = props.modelValue.address;
    addressInfo.latitude = props.modelValue.latitude;
    addressInfo.longitude = props.modelValue.longitude;
  }
});
const initMap = () => {
  map.value = null;
  BMPGL(ak.value).then((BMapGL: any) => {
    map.value = new BMapGL.Map("baidumap");
    const ac = new BMapGL.Autocomplete({
      //建立一个自动完成的对象
      input: "suggestId",
      location: map.value,
    });
    const zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件
    map.value.addControl(zoomCtrl);
    const cityCtrl = new BMapGL.CityListControl(); // 添加城市列表控件
    map.value.addControl(cityCtrl);
    // const LocationControl = new BMapGL.LocationControl(); // 添加定位控件，用于获取定位
    // map.value.addControl(LocationControl);
    const scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件
    map.value.addControl(scaleCtrl);
    map.value.setMapType(); // 设置地图类型为标准地图模式；
    const localcity = new BMapGL.LocalCity();
    localcity.get((e: { name: any }) => {
      map.value.centerAndZoom(e.name, mapZoom.value);
    });

    let point: any;

    //初始化的时候如果有经纬度，需要先在地图上添加点标记
    if (addressInfo.longitude && addressInfo.latitude) {
      point = new BMapGL.Point(addressInfo.longitude, addressInfo.latitude);
      map.value.centerAndZoom(point, mapZoom.value);
      const marker2 = new BMapGL.Marker(point);
      //在地图上添加点标记
      map.value.addOverlay(marker2);
    }

    map.value.enableScrollWheelZoom(true);
    // map.value.setHeading(64.5);
    // map.value.setTilt(73);

    //点击下拉框的值
    map.value.addEventListener("click", function (e: { latlng: { lng: string; lat: string } }) {
      map.value.clearOverlays();
      const point1 = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
      // 创建点标记
      const marker1 = new BMapGL.Marker(point1);
      // 在地图上添加点标记
      map.value.addOverlay(marker1);
      addressInfo.longitude = e.latlng.lng;
      addressInfo.latitude = e.latlng.lat;
      const geoc = new BMapGL.Geocoder(); // 创建地址解析器的实例
      geoc.getLocation(point1, (rs: { addressComponents: any }) => {
        const adr = rs.addressComponents;
        addressInfo.address = adr.province + adr.city + adr.district + adr.street + adr.streetNumber; // 省市区街道门牌号
      });
    });
    ac.addEventListener("onconfirm", function (e: { item: { value: any } }) {
      //鼠标点击下拉列表后的事件
      const _value = e.item.value;
      addressInfo.address = _value.province + _value.city + _value.district + _value.street + _value.business;
      // 搜索
      map.value.clearOverlays(); //清除地图上所有覆盖物
      //智能搜索
      const local = new BMapGL.LocalSearch(map.value, {
        onSearchComplete: () => {
          //获取第一个智能搜索的结果
          const pp = local.getResults().getPoi(0).point;
          map.value.centerAndZoom(pp, mapZoom.value);
          map.value.addOverlay(new BMapGL.Marker(pp)); //添加标注
          addressInfo.longitude = pp.lng;
          addressInfo.latitude = pp.lat;
        },
      });
      local.search(addressInfo.address);
    });
  });
};
/** 打开地图选择 */
const show = () => {
  openMap.value = true;
  initMap();
};
/**
 * 确认选择
 */
const confirmSelect = () => {
  if (addressInfo.address == "") {
    ElMessage({
      message: "请选择位置",
      type: "error",
      center: true,
    });
    return;
  }
  emit("confirmMapAddress", addressInfo);
  emit("update:modelValue", addressInfo);
  openMap.value = false;
};
/**
 * 取消选择
 */
const cancel = () => {
  openMap.value = false;
};
//#endregion ========================================================================
/////////////////////////////////////////////////////////////////////////////////////
//#region ----操作方法----------------------------------------------------------------

//#endregion ========================================================================
/////////////////////////////////////////////////////////////////////////////////////
//#region ----其他方法----------------------------------------------------------------
defineExpose({
  show,
});
//#endregion ========================================================================
////////////////////////////////////////////////////////////////////////////////////
</script>

<style>
.tangram-suggestion {
  z-index: 99999;
}
</style>
<style scoped lang="scss">
:deep(.BMap_cpyCtrl) {
  display: none !important;
}
:deep(.BMap_cpyCtrl) {
  display: none !important;
}

:deep(.el-dialog__header),
:deep(.el-dialog__footer) {
  padding: 15px 20px;
}

:deep(.el-dialog__body) {
  border-top: 1px solid #e8eaec;
  border-bottom: 1px solid #e8eaec;
  padding: 20px;
}
:deep(.el-dialog__headerbtn) {
  top: 0;
  font-size: 18px;
}
:deep(.el-dialog) {
  border-radius: 8px;
}
</style>
