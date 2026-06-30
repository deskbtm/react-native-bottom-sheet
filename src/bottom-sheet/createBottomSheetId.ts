let sheetIdCounter = 0;

export function createBottomSheetId(): string {
	sheetIdCounter += 1;
	return `sheet-${sheetIdCounter}-${Date.now()}`;
}
