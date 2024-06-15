module.exports = async imageUrl => {
	const response = await fetch(imageUrl)
	if (!response.ok) {
		throw new Error('Не удалось загрузить изображение.')
	}
	const blob = await response.blob()
	return new File([blob], 'image.jpg', { type: 'image/jpeg' })
}
