import { Bill } from 'src/bills/entities/bill.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { Parameter } from 'src/parameters/entities/parameter.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Service } from 'src/services/entities/service.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { Payment } from 'src/payments/entities/payment.entity';

@Entity()
export class Apartment {
    @PrimaryColumn()
    number: number;

    @Column()
    floor: number;

    @Column()
    axis: number;

    @Column("decimal")
    acreage: number;

    @Column({ default: false })
    maintaining: boolean;

    @Column({ default: false })
    tenantLooking: boolean;

    @Column({ nullable: true })
    rentStart: Date;

    @Column("decimal", { default: 0 })
    rentPrice: number;

    @Column({ nullable: true })
    adTitle: string;

    @Column({ nullable: true })
    advertisement: string;

    @Column({ default: true })
    hasBalcony: boolean;

    @Column({ nullable: true })
    lastMaintain: Date;

    @Column("decimal", { default: 0 })
    debt: number

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Owner, owner => owner.apartments, { nullable: true })
    owner: Owner

    @OneToMany(() => Parameter, parameter => parameter.apartment, { onDelete: "CASCADE" })
    parameters: Parameter[]

    @OneToMany(() => Resident, resident => resident.apartment, { onDelete: "SET NULL" })
    residents: Resident[]

    @OneToMany(() => Visitor, visitor => visitor.apartment, { onDelete: "SET NULL" })
    visitors: Visitor[]

    @OneToMany(() => Service, service => service.apartment, { onDelete: "SET NULL" })
    services: Service[]

    @OneToMany(() => Bill, bill => bill.apartment, { onDelete: "CASCADE" })
    bills: Bill[]

    @OneToMany(() => Payment, payment => payment.apartment, { onDelete: "SET NULL" })
    payments: Payment[]

    @OneToMany(() => Room, room => room.apartment, { onDelete: "CASCADE" })
    rooms: Room[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
