import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, SquarePenIcon, TrashIcon, X } from "lucide-react"
import { memo, useCallback, useState } from "react"
import { Plugin, pluginActions, pluginStore } from "@/store/plugin"
import { FormValueType } from "@/store/plugin/config"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSnapshot } from "valtio"
import { initPluginConfig } from "@/store/plugin/utils"
import { deepClone } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface Props {
  plugin: Plugin
}

export const PluginConfig = memo<Props>(({ plugin }) => {
  const pluginState = useSnapshot(pluginStore)

  const [open, setOpen] = useState(false)

  type FormValues = FormValueType<typeof plugin.configForm>;
  type FormErrors = {
    [K in keyof FormValues]?: string;
  }

  const [formValue, setFormValue] = useState<FormValues>(
    deepClone(pluginState.pluginSettings[plugin.namespace] || initPluginConfig(plugin))
  )
  const [errors, setErrors] = useState<FormErrors>({});

  // 使用 config 提供的 validate 函数，校验表单值，返回一个布尔值，具体的错误信息在 errors 中
  const doValidate = useCallback(() => {
    const newErrors: FormErrors = {};

    plugin.configForm?.forEach((field) => {
      const value = formValue[field.name];

      // 必填校验
      if (field.required && !value) {
        newErrors[field.name] = '此项为必填项';
        return;
      }

      // 根据类型进行校验
      switch (field.type) {
        case 'text':
        case 'textarea':
          if (field.props?.minLength && String(value).length < field.props.minLength) {
            newErrors[field.name] = `最少需要 ${field.props.minLength} 个字符`;
          }
          if (field.props?.maxLength && String(value).length > field.props.maxLength) {
            newErrors[field.name] = `最多允许 ${field.props.maxLength} 个字符`;
          }
          break;
        case 'number':
        case 'slider':
          if (field.props?.min && Number(value) < field.props.min) {
            newErrors[field.name] = `不能小于 ${field.props.min}`;
          }
          if (field.props?.max && Number(value) > field.props.max) {
            newErrors[field.name] = `不能大于 ${field.props.max}`;
          }
          break;
        case 'list':
          if (field.props?.min && (value as string[]).length < field.props.min) {
            newErrors[field.name] = `至少需要 ${field.props.min} 项`;
          }
          if (field.props?.max && (value as string[]).length > field.props.max) {
            newErrors[field.name] = `最多允许 ${field.props.max} 项`;
          }
          break;
      }

      // 自定义验证器
      if (field.validator) {
        // @ts-ignore
        const error = field.validator(value);
        if (error) {
          newErrors[field.name] = typeof error === 'string' ? error : '验证失败';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValue, plugin.configForm])

  const handleSave = useCallback(() => {
    setErrors(() => ({}))
    if (doValidate()) {
      pluginActions.savePluginConfig(plugin.namespace, formValue)
      setOpen(false)
      // TODO: 提示
    }
  }, [formValue, doValidate])

  return (
    <>
      {plugin.configForm?.length > 0 && (
        <Button
          className="ec-border ec-border-transparent ec-flex-shrink-0 ec-ml-2"
          variant="default"
          size="sm"
          onClick={() => {
            setOpen(true)
          }}
        >
          <SquarePenIcon className="ec-w-4 ec-h-4" />
        </Button>
      )}
      {/* 不使用dialog，因为dialog的样式会影响到主应用的样式 */}
      {open && (
        <div className="ec-fixed ec-w-96 ec-max-w-lg ec-max-h-full ec-flex ec-flex-col ec-top-1/2 ec-left-1/2 ec-bg-white ec-p-4 ec-shadow-lg ec-rounded-lg ec-border ec-border-gray-200 -ec-translate-x-1/2 -ec-translate-y-1/2">
          {/* 标题 */}
          <div className="ec-flex ec-justify-between ec-mb-2 ec-border-b ec-border-gray-200 ec-flex-shrink-0">
            <div className="ec-text-lg ec-font-bold ec-flex-grow">{plugin.name} 配置</div>
            <Button className="ec-flex-shrink-0" variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="ec-w-4 ec-h-4" />
            </Button>
          </div>
          <div className="ec-flex ec-flex-col ec-gap-4 ec-flex-grow ec-h-full ec-overflow-y-auto">
            {/* 配置表单 */}
            <div className="ec-flex ec-flex-col ec-gap-3">
              {plugin.configForm?.map((item) => {
                const { name, label, type } = item
                // 重构一下，把表单组件动态放到value中，取代下面的if-else写法
                return (
                  <div className="item" key={name}>
                    <div className="label ec-select-none ec-mb-1">
                      <span className="ec-text-sm">{label}</span>
                      {/* 必填 */}
                      {item.required && <span className="ec-text-red-500">*</span>}
                    </div>
                    <div className="value">
                      {/* 文本输入框 */}
                      {type === 'text' && (
                        <Input
                          placeholder={item.props?.placeholder}
                          value={formValue[name] as string}
                          onChange={(e) => setFormValue({ ...formValue, [name]: e.target.value })}
                          maxLength={item.props?.maxLength}
                          minLength={item.props?.minLength}
                        />
                      )}
                      {/* 多行文本输入框 */}
                      {type === 'textarea' && (
                        <Textarea
                          placeholder={item.props?.placeholder}
                          value={formValue[name] as string}
                          onChange={(e) => setFormValue({ ...formValue, [name]: e.target.value })}
                          maxLength={item.props?.maxLength}
                          minLength={item.props?.minLength}
                          rows={item.props?.rows}
                        />
                      )}
                      {/* 颜色选择器 */}
                      {type === 'color' && (
                        <Input
                          type="color"
                          value={formValue[name] as string}
                          onChange={(e) => setFormValue({ ...formValue, [name]: e.target.value })}
                        />
                      )}
                      {/* 下拉选择框 */}
                      {type === 'select' && (
                        <Select
                          value={formValue[name] as string}
                          onValueChange={(value) => setFormValue({ ...formValue, [name]: value })}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={item.props?.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {/* 数字输入框 */}
                      {type === 'number' && (
                        <Input type="number" value={formValue[name] as string} onChange={(e) => setFormValue({ ...formValue, [name]: e.target.value })} />
                      )}
                      {/* 滑块 */}
                      {type === 'slider' && (
                        <Slider
                          value={[formValue[name] as number]}
                          onValueChange={(value: number[]) => setFormValue({ ...formValue, [name]: value[0] })}
                          max={item.props?.max}
                          min={item.props?.min}
                          step={item.props?.step}
                        />
                      )}
                      {/* switch */}
                      {type === 'switch' && (
                        <Switch
                          checked={formValue[name] as boolean}
                          onCheckedChange={(checked) => setFormValue({ ...formValue, [name]: checked })}
                        />
                      )}
                      {/* 列表 */}
                      {type === 'list' && (
                        <div className="ec-flex ec-flex-col ec-gap-2">
                          {(formValue[name] as string[])?.map((listItem, index) => (
                            <div key={index} className="ec-flex ec-gap-2">
                              <Input
                                type="text"
                                value={listItem}
                                onChange={(e) => setFormValue({ ...formValue, [name]: (formValue[name] as string[]).map((_, i) => i === index ? e.target.value : _) })}
                                placeholder={item.props?.placeholder}
                                maxLength={item.props?.maxLength}
                                minLength={item.props?.minLength}
                              />
                              {/* 当没有设置 min 或数组长度大于 min 时显示删除按钮 */}
                              {(!item.props?.min || (formValue[name] as string[]).length > item.props.min) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setFormValue({
                                    ...formValue,
                                    [name]: (formValue[name] as string[]).filter((_, i) => i !== index)
                                  })}
                                >
                                  <TrashIcon className="ec-w-4 ec-h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {/* 添加按钮 */}
                          {(!item.props?.max || (formValue[name] as string[]).length < item.props.max) && (
                            <Button className="ec-w-full" variant="ghost" size="icon" onClick={() => setFormValue({ ...formValue, [name]: [...(formValue[name] as string[]), ''] })}>
                              <PlusIcon className="ec-w-4 ec-h-4" />
                              <span>添加</span>
                            </Button>
                          )}
                        </div>
                      )}
                      {/* 日期 */}
                      {type === 'date' && (
                        <Input type="date" value={formValue[name] as string} onChange={(e) => setFormValue({ ...formValue, [name]: e.target.value })} />
                      )}
                    </div>
                    {/* 描述 */}
                    {item.description && (
                      <div className="ec-text-xs ec-text-gray-500">{item.description}</div>
                    )}
                    {/* 错误信息 */}
                    {errors[name] && (
                      <div className="ec-text-xs ec-text-red-500">{errors[name]}</div>
                    )}
                  </div>
                )
              })}
            </div>
            {/* 保存按钮 */}
            <Button className="ec-flex-shrink-0" variant="default" size="sm" onClick={handleSave}>保存</Button>
          </div>
        </div>
      )}
    </>
  )
})
