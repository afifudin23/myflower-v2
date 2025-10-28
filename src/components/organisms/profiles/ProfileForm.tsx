import Label from "@/components/atoms/Label";
import InputText from "@/components/molecules/inputs/InputText";
import { PROFILE_FORM_ITEMS } from "@/components/organisms/profiles/profile.constants";
import { Controller } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";

function ProfileForm({ control, errors }: any) {
    return (
        <div className="flex flex-col gap-3">
            {PROFILE_FORM_ITEMS.map((item) => {
                switch (item.type) {
                    case "dropdown":
                        return (
                            <Controller
                                key={item.name}
                                name={item.name}
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Label id={item.name} children={item.label} />
                                        <div className="relative w-full">
                                            <select
                                                {...field}
                                                className="border appearance-none py-2 2xl:py-3 px-4 rounded-lg w-full text-base 2xl:text-xl"
                                            >
                                                <option value="">-- Input Kategori Pelanggan --</option>
                                                {item.options?.map((option: any) => (
                                                    <option key={option} value={option}>
                                                        {item.optionLabel[option]}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Icon custom */}
                                            <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none h-6 w-6" />
                                        </div>
                                        {errors[item.name] && (
                                            <p className="text-red-500 text-xs 2xl:text-sm">
                                                *{errors[item.name]?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        );

                    case "text":
                    default:
                        return (
                            <InputText
                                key={item.name}
                                name={item.name}
                                label={item.label}
                                type={item.type}
                                control={control}
                                error={errors[item.name]}
                            />
                        );
                }
            })}
        </div>
    );
}

export default ProfileForm;
