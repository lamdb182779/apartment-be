import { Accountant } from "src/accountants/entities/accountant.entity";
import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Technician } from "src/technicians/entities/technician.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({ default: false })
    isComplete: boolean

    @Column()
    deadline: Date

    @ManyToMany(() => Receptionist, receptionist => receptionist.tasks)
    receptionists: Receptionist[]

    @ManyToMany(() => Accountant, accountant => accountant.tasks)
    accountants: Accountant[]

    @ManyToMany(() => Technician, technician => technician.tasks)
    technicians: Technician[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
