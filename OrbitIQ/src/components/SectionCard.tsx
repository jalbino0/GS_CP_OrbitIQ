import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../constants/theme";

type Variant = "default" | "purple" | "blue" | "green" | "red" | "yellow";

type SectionCardProps = {
  children: ReactNode;
  variant?: Variant;
  style?: ViewStyle;
};

const variantStyles: Record<Variant, { backgroundColor: string; borderColor: string }> = {
  default: { backgroundColor: COLORS.card, borderColor: COLORS.border },
  purple: { backgroundColor: COLORS.cardPurple, borderColor: COLORS.borderPurple },
  blue: { backgroundColor: COLORS.cardBlue, borderColor: COLORS.borderBlue },
  green: { backgroundColor: COLORS.cardGreen, borderColor: COLORS.borderGreen },
  red: { backgroundColor: COLORS.cardRed, borderColor: COLORS.borderRed },
  yellow: { backgroundColor: COLORS.cardYellow, borderColor: COLORS.borderYellow },
};

export function SectionCard({ children, variant = "default", style }: SectionCardProps) {
  const currentVariant = variantStyles[variant];
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
});
