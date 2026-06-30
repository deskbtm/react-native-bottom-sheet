import { StyleSheet, View } from 'react-native';

interface BottomSheetHandleProps {
	color: string;
}

export function BottomSheetHandle({ color }: BottomSheetHandleProps) {
	return (
		<View style={styles.handleArea}>
			<View style={[styles.handle, { backgroundColor: color }]} />
		</View>
	);
}

const styles = StyleSheet.create({
	handleArea: {
		alignItems: 'center',
		paddingVertical: 10,
	},
	handle: {
		width: 36,
		height: 5,
		borderRadius: 3,
	},
});
