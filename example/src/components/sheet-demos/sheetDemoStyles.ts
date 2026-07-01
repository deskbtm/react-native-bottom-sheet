import { StyleSheet } from 'react-native';

export const sheetDemoStyles = StyleSheet.create({
	sheetInner: {
		padding: 20,
		gap: 12,
	},
	listHeader: {
		gap: 8,
		marginBottom: 8,
	},
	sheetTitle: {
		fontSize: 22,
		fontWeight: '700',
	},
	sheetSubtitle: {
		opacity: 0.6,
		lineHeight: 20,
	},
	sheetRow: {
		padding: 14,
		backgroundColor: '#F2F2F7',
		borderRadius: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#D1D1D6',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	rowActions: {
		flexDirection: 'row',
		gap: 10,
	},
	demoButton: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 10,
		width: '100%',
		alignItems: 'center',
	},
	demoButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 15,
	},
	secondaryButton: {
		flex: 1,
		backgroundColor: '#EFEFF4',
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: 'center',
	},
	secondaryButtonText: {
		fontWeight: '600',
	},
	closeButton: {
		marginTop: 8,
		backgroundColor: '#FF3B30',
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: '600',
	},
});
