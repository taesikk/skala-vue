<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { loadKakaoMaps } from '@/services/kakaoMapLoader'

const props = defineProps({
  centerLat: {
    type: Number,
    required: true,
  },
  centerLon: {
    type: Number,
    required: true,
  },
  places: {
    type: Array,
    default: () => [],
  },
})

const mapContainer = ref(null)
const mapError = ref(null)

let kakaoRef = null
let mapInstance = null
let markers = []
let infoWindow = null

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
}

function renderMarkers(kakao) {
  clearMarkers()
  infoWindow?.close()

  props.places.forEach((place) => {
    const position = new kakao.maps.LatLng(place.lat, place.lon)
    const marker = new kakao.maps.Marker({ position, map: mapInstance })
    kakao.maps.event.addListener(marker, 'click', () => {
      infoWindow.setContent(
        `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${place.name}</div>`,
      )
      infoWindow.open(mapInstance, marker)
    })
    markers.push(marker)
  })
}

async function initMap() {
  try {
    const kakao = await loadKakaoMaps()
    kakaoRef = kakao
    const center = new kakao.maps.LatLng(props.centerLat, props.centerLon)
    mapInstance = new kakao.maps.Map(mapContainer.value, { center, level: 6 })
    infoWindow = new kakao.maps.InfoWindow({ removable: true })
    renderMarkers(kakao)
  } catch (err) {
    mapError.value = err.message
  }
}

onMounted(initMap)

watch(
  () => [props.centerLat, props.centerLon],
  () => {
    if (!mapInstance || !kakaoRef) return
    mapInstance.setCenter(new kakaoRef.maps.LatLng(props.centerLat, props.centerLon))
  },
)

watch(
  () => props.places,
  () => {
    if (!mapInstance || !kakaoRef) return
    renderMarkers(kakaoRef)
  },
)

onBeforeUnmount(clearMarkers)
</script>

<template>
  <div class="kakao-map">
    <div v-if="mapError" class="kakao-map__error">
      <p>🗺️ {{ mapError }}</p>
    </div>
    <div v-show="!mapError" ref="mapContainer" class="kakao-map__canvas"></div>
  </div>
</template>

<style scoped>
.kakao-map {
  width: 100%;
  height: 220px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.kakao-map__canvas {
  width: 100%;
  height: 100%;
}

.kakao-map__error {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  background: var(--color-surface-soft);
}
</style>
