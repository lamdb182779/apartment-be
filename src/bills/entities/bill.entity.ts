
import { Accountant } from 'src/accountants/entities/accountant.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Bill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "Không có tiêu đề" })
    title: string;

    @Column("simple-json")
    content: any[];

    @Column("decimal")
    amount: number;

    @Column({ default: "Dịch vụ khác" })
    type: string;

    @Column({ default: false })
    isPaid: boolean;

    @Column()
    expired: Date;

    @ManyToOne(() => Accountant, accountant => accountant.bills, { nullable: true })
    accountant: Accountant

    @ManyToOne(() => Apartment, apartment => apartment.bills)
    apartment: Apartment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
