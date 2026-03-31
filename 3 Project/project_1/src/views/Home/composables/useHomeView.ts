export function useHomeView() {
	/**
	 * 业务层提交
	 * @async
	 * @param { Record<string, any> } formData
	 * @returns { Promise<void> }
	 */
	async function handleSubmitAsync(
		formData: Record<string, any>,
	): Promise<void> {
		try {
			console.log(formData);
		} catch (error) {}
	}

	return {
		handleSubmitAsync,
	};
}
