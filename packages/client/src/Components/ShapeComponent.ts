import { Utils } from "@rpgjs/common"
import { AbstractComponent, CellInfo } from "./AbstractComponent"
import { ShapeComponentObject } from "@rpgjs/types"

export class ShapeComponent extends AbstractComponent<ShapeComponentObject, PIXI.Graphics> {
    static readonly id: string = 'shape'
    private type: ShapeComponentObject['value']['type'] = this.value.type
    private container: PIXI.Graphics = new PIXI.Graphics()
    cacheParams: string[] = []

    onInit(cell: CellInfo) {
        this.updateRender(this.component.logic)
        this.addChild(this.container)
        super.onInit(cell)
    }

    updateRender(object: any) {
        const value = this.value as any
        const height = this.getValue(object, value.height) ?? this.cell?.height ?? 0
        const width = this.getValue(object, value.width) ?? this.cell?.width ?? 0

        this.container.clear()
        this.container.beginFill(Utils.hexaToNumber(this.value.fill))
       
        if (value.line) {
            this.container.lineStyle(
                this.getValue(object, value.line.width) ?? 1,
                Utils.hexaToNumber(value.line.color ?? this.value.fill),
                this.getValue(object, value.line.alpha) ?? 1
            )
        }

        switch (this.type) {
            case 'circle':
                this.container.drawCircle(0, 0, this.getValue(object, value.radius))
                break;
            case 'ellipse':
                this.container.drawEllipse(0, 0, width, height)
                break;
            case 'line':
                if  (!value.line) {
                    this.container.lineStyle(1, Utils.hexaToNumber(this.value.fill))
                }
                this.container.moveTo(this.getValue(object, value.x1), this.getValue(object, value.y1))
                this.container.lineTo(this.getValue(object, value.x2), this.getValue(object, value.y2))
                break;
            case 'polygon':
                this.container.drawPolygon(value.points)
                break;
            case 'rounded-rect':
                this.container.drawRoundedRect(0, 0, width, height, value.radius)
                break;
            default:
                this.container.drawRect(0, 0, width, height)
                break;
        }

        this.container.endFill()
    }
}