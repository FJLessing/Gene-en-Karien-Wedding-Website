<script lang="ts" setup>
// Photo upload (Story 3/4). Posts selected files to /api/photos (GCP, stubbed).
import BaseButton from "~/components/ui/BaseButton.vue";
import { ApiService } from "~/services/api-service";

const files = ref<File[]>([]);
const isUploading = ref(false);
const message = ref("");

function onChange(event: Event): void {
	const input = event.target as HTMLInputElement;
	files.value = input.files ? Array.from(input.files) : [];
}

async function upload(): Promise<void> {
	if (files.value.length === 0) return;

	isUploading.value = true;
	message.value = "";

	const formData = new FormData();
	files.value.forEach((file) => formData.append("photos", file, file.name));

	const result = await ApiService._request("/api/photos", "POST", undefined, formData, true);
	isUploading.value = false;
	message.value = result.success ? "Thanks for sharing your photos!" : result.msg || "Upload failed.";
}
</script>

<template>
	<div class="photo-upload">
		<label class="photo-upload__label">
			<input type="file" accept="image/*" multiple class="photo-upload__input" @change="onChange" />
			<span>Choose photo(s)</span>
		</label>
		<p v-if="files.length" class="photo-upload__count">{{ files.length }} selected</p>
		<BaseButton :disabled="files.length === 0" :loading="isUploading" @click="upload">Upload photos</BaseButton>
		<p v-if="message" class="photo-upload__message">{{ message }}</p>
	</div>
</template>

<style scoped lang="scss">
.photo-upload {
	display: flex;
	flex-direction: column;
	gap: $space-2xs;
	width: 100%;
}

.photo-upload__label {
	display: inline-flex;
	justify-content: center;
	padding: $space-2xs;
	border: 1px dashed $color-border;
	border-radius: $radius-md;
	font-size: $font-size-sm;
	cursor: pointer;
}

.photo-upload__input {
	display: none;
}

.photo-upload__count {
	font-size: $font-size-xs;
	color: $color-text-muted;
}

.photo-upload__message {
	font-size: $font-size-sm;
	color: $color-text-muted;
}
</style>
