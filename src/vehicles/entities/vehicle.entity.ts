import { Tenant } from "src/tenants/entities/tenant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Vehicle {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    image: string;

    @ManyToOne(() => Tenant, tenant => tenant.vehicles)
    tenant: Tenant

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
