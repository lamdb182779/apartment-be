import { Bill } from 'src/bills/entities/bill.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { Parameter } from 'src/parameters/entities/parameter.entity';
import { Tentant } from 'src/tentants/entities/tentant.entity';
import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Apartment {
    @PrimaryColumn()
    number: number;

    @Column()
    floor: number;

    @Column()
    axis: number;

    @Column()
    acreage: number;

    @ManyToOne(() => Owner, owner => owner.apartments, { nullable: true })
    owner: Owner

    @OneToMany(() => Parameter, parameter => parameter.apartment)
    parameters: Parameter[]

    @OneToOne(() => Tentant, tentant => tentant.apartment, { nullable: true })
    tentant: Tentant

    @OneToMany(() => Bill, bill => bill.apartment)
    bills: Bill[]
}
